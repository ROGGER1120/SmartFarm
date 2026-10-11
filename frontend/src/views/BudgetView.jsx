import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Edit3, 
  Plus, 
  RefreshCw,
  PieChart as PieIcon,
  BarChart2,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { api } from '../api';

export default function BudgetView({ farmId }) {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategories, setEditCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (farmId) {
      loadBudget();
    }
  }, [farmId]);

  const loadBudget = async () => {
    try {
      setLoading(true);
      const data = await api.getBudgetAnalysis(farmId);
      setBudgetData(data);
      if (data?.categories) {
        setEditCategories(data.categories.map(c => ({
          category: c.category,
          planned: c.planned,
          actual: c.actual,
          notes: c.notes || ''
        })));
      }
    } catch (err) {
      console.error('Error loading budget', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateBudget({
        farmId,
        season: budgetData?.season || 'Kharif 2026',
        categories: editCategories
      });
      setShowEditModal(false);
      await loadBudget();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading Budget vs Actual analysis...</p>
      </div>
    );
  }

  const categories = budgetData?.categories || [];
  const exceededList = budgetData?.exceededCategories || [];

  const chartData = categories.map(cat => ({
    name: cat.category,
    Planned: cat.planned,
    Actual: cat.actual,
    isExceeded: cat.isExceeded
  }));

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Cultivation Budget Management
            </h1>
            <span className="badge badge-info" style={{ fontSize: '0.8rem' }}>
              {budgetData?.season || 'Kharif 2026'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Comprehensive Budget vs Actual expenditure tracking with instant cost overrun highlight
          </p>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="btn btn-primary"
        >
          <Edit3 size={16} />
          <span>Edit Cultivation Budget</span>
        </button>
      </div>

      {/* OVER-BUDGET ALERT BANNER (If any category exceeded) */}
      {exceededList.length > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.15)',
          animation: 'pulseDanger 2.5s infinite ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldAlert size={24} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b' }}>
                ⚠️ Budget Overrun Alert: {exceededList.length} Categories Exceeded Planned Budget!
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#b91c1c', marginTop: '2px' }}>
                {exceededList.map(item => `${item.category} (+₹${item.variance.toLocaleString()} / +${item.variancePercentage}%)`).join(' • ')}
              </p>
            </div>
          </div>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Action Required
          </span>
        </div>
      )}

      {/* Top 4 Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Total Planned */}
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Planned Cultivation Budget
          </span>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{budgetData?.totalPlanned?.toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            Allocated across {categories.length} categories
          </p>
        </div>

        {/* Total Actual */}
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Actual Incurred Expenses
          </span>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: budgetData?.isOverallExceeded ? '#ef4444' : 'var(--text-main)' }}>
              ₹{budgetData?.totalActual?.toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Aggregated from Water, Fertilizer, Labour, Machinery
          </p>
        </div>

        {/* Remaining Budget */}
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Remaining Cultivation Buffer
          </span>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: budgetData?.remainingBudget < 0 ? '#ef4444' : '#059669' }}>
              ₹{budgetData?.remainingBudget?.toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {budgetData?.remainingBudget === 0 ? '100% budget utilized (Break-even)' : 'Available headroom'}
          </p>
        </div>

        {/* Overrun Status */}
        <div className="card" style={{
          padding: '20px',
          borderLeft: exceededList.length > 0 ? '4px solid #ef4444' : '4px solid #10b981'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Budget Adherence Status
          </span>
          <div style={{ marginTop: '8px' }}>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: exceededList.length > 0 ? '#ef4444' : '#059669'
            }}>
              {exceededList.length > 0 ? `${exceededList.length} Categories Exceeded!` : 'All Within Budget'}
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: exceededList.length > 0 ? '#b91c1c' : '#047857', marginTop: '4px', fontWeight: 600 }}>
            {exceededList.length > 0 ? 'Highlighted in Red Below' : 'On Track'}
          </p>
        </div>
      </div>

      {/* Grid: Comparison Table (Left) & Chart (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(480px, 1.4fr) 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Table: Budget vs Actual Analysis */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Budget vs Actual Analysis Table
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Currency: INR (₹)
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-secondary)' }}>Planned</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-secondary)' }}>Actual</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-secondary)' }}>Variance</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((row) => (
                  <tr 
                    key={row.category}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: row.isExceeded ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {row.isExceeded && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#ef4444',
                            boxShadow: '0 0 6px rgba(239, 68, 68, 0.7)'
                          }} />
                        )}
                        <span>{row.category}</span>
                      </div>
                      {row.notes && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '200px' }}>
                          {row.notes}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      ₹{row.planned?.toLocaleString()}
                    </td>

                    <td style={{
                      padding: '14px 18px',
                      fontWeight: 700,
                      color: row.isExceeded ? '#dc2626' : 'var(--text-main)',
                      fontSize: row.isExceeded ? '0.94rem' : '0.86rem'
                    }}>
                      ₹{row.actual?.toLocaleString()}
                    </td>

                    <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: row.isExceeded ? '#ef4444' : row.variance === 0 ? 'var(--text-muted)' : '#059669'
                      }}>
                        {row.isExceeded ? (
                          <>
                            <ArrowUpRight size={15} />
                            <span>+₹{row.variance.toLocaleString()} (+{row.variancePercentage}%)</span>
                          </>
                        ) : row.variance === 0 ? (
                          <span>₹0 (0%)</span>
                        ) : (
                          <>
                            <ArrowDownRight size={15} />
                            <span>-₹{Math.abs(row.variance).toLocaleString()} ({row.variancePercentage}%)</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span className={`badge ${
                        row.isExceeded 
                          ? 'badge-danger' 
                          : row.status === 'Near Limit' 
                          ? 'badge-warning' 
                          : 'badge-success'
                      }`} style={{
                        boxShadow: row.isExceeded ? '0 0 8px rgba(239, 68, 68, 0.35)' : 'none'
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr style={{
                  backgroundColor: 'var(--bg-body)',
                  fontWeight: 800,
                  borderTop: '2px solid var(--border-color)'
                }}>
                  <td style={{ padding: '16px 18px', fontSize: '0.92rem' }}>Total</td>
                  <td style={{ padding: '16px 18px', fontSize: '0.92rem' }}>
                    ₹{budgetData?.totalPlanned?.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 18px', fontSize: '0.92rem' }}>
                    ₹{budgetData?.totalActual?.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 18px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    ₹0 (100% matched)
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <span className="badge badge-info">
                      Balanced
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Visual Comparison Chart */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Planned vs Actual Expenditure (₹)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Over-budget categories highlighted with red actual bars
            </p>
          </div>

          <div style={{ flex: 1, minHeight: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="Planned" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isExceeded ? '#ef4444' : '#3b82f6'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            marginTop: '8px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#059669', borderRadius: '2px' }} />
              Planned
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '2px' }} />
              Actual (On Track)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
              Actual (Exceeded!)
            </span>
          </div>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>
              Set Cultivation Budget for {budgetData?.season || 'Kharif 2026'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Define planned limits for each farm category to activate over-budget warnings
            </p>

            <form onSubmit={handleSaveBudget}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {editCategories.map((cat, idx) => (
                  <div key={idx} style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 1fr',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-body)'
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cat.category}</span>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                        Planned (₹)
                      </label>
                      <input
                        type="number"
                        className="input-control"
                        value={cat.planned}
                        onChange={(e) => {
                          const updated = [...editCategories];
                          updated[idx].planned = Number(e.target.value);
                          setEditCategories(updated);
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                        Notes / Allocation
                      </label>
                      <input
                        type="text"
                        className="input-control"
                        value={cat.notes}
                        onChange={(e) => {
                          const updated = [...editCategories];
                          updated[idx].notes = e.target.value;
                          setEditCategories(updated);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : 'Save & Recalculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
