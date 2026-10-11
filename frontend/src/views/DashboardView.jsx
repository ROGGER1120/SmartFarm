import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Sprout, 
  Droplet, 
  Tractor, 
  Package, 
  Users, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  TrendingUp,
  FlaskConical,
  Sun,
  CloudRain
} from 'lucide-react';
import { api } from '../api';

export default function DashboardView({ farmId, onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [budget, setBudgetData] = useState(null);
  const [soil, setSoil] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmId) {
      loadData();
    }
  }, [farmId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sumRes, bgtRes, soilRes, cropsRes] = await Promise.all([
        api.getDashboardSummary(farmId),
        api.getBudgetAnalysis(farmId),
        api.getSoilReport(farmId),
        api.getCrops(farmId)
      ]);
      setSummary(sumRes);
      setBudgetData(bgtRes);
      setSoil(soilRes);
      setCrops(cropsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading dashboard overview...
      </div>
    );
  }

  const exceededCategories = budget?.exceededCategories || [];

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #062319 0%, #0d3827 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              backgroundColor: 'rgba(52, 211, 153, 0.2)',
              color: '#34d399',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              Kharif Season 2026 Active
            </span>
            <span style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>• Pollachi Taluk, Coimbatore</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Welcome back, Farmer Arini
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#a7f3d0', marginTop: '4px', maxWidth: '640px' }}>
            Your farm optimization engine is monitoring soil nutrients, water consumption schedules, machinery servicing, and live cultivation budget adherence.
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '12px 18px',
          textAlign: 'right'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <Sun size={20} color="#facc15" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>29°C</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Humidity: 68% • Light Breeze</span>
          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600, marginTop: '2px' }}>
            No Rain Expected Today
          </div>
        </div>
      </div>

      {/* SPECIAL HIGHLIGHT: Budget Overrun Alert Bar if actual exceeds planned */}
      {exceededCategories.length > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => onNavigate('budget')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} color="#dc2626" />
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#991b1b' }}>
                Budget vs Actual Alert: {exceededCategories.length} Categories Exceeded Planned Cost!
              </span>
              <p style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: '2px' }}>
                {exceededCategories.map(c => `${c.category}: Planned ₹${c.planned.toLocaleString()} vs Actual ₹${c.actual.toLocaleString()} (+₹${c.variance.toLocaleString()})`).join(' | ')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 700, fontSize: '0.82rem' }}>
            <span>Review Budget Details</span>
            <ArrowRight size={16} />
          </div>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Total Expenses */}
        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onNavigate('budget')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Cultivation Expenses</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#ecfdf5' }}>
              <DollarSign size={18} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            ₹{summary?.totalExpenses?.toLocaleString()}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Budget Planned: ₹{summary?.plannedBudget?.toLocaleString()}
          </p>
        </div>

        {/* Active Crops */}
        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onNavigate('crops')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Crops Tracked</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fef3c7' }}>
              <Sprout size={18} color="#d97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {crops.length} Crops
          </div>
          <p style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            Sunflower • Paddy • Tomato
          </p>
        </div>

        {/* Water Status */}
        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onNavigate('water')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Water Management</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#e0f2fe' }}>
              <Droplet size={18} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: summary?.abnormalWaterCount > 0 ? '#ef4444' : 'var(--text-main)' }}>
            {summary?.abnormalWaterCount > 0 ? 'Leak Alert!' : 'Normal Flow'}
          </div>
          <p style={{ fontSize: '0.74rem', color: summary?.abnormalWaterCount > 0 ? '#b91c1c' : 'var(--text-secondary)', marginTop: '4px' }}>
            {summary?.abnormalWaterCount > 0 ? '1 High usage detected' : 'Drip schedule on track'}
          </p>
        </div>

        {/* Soil Health Score */}
        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onNavigate('soil')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Soil pH & Nutrients</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f3e8ff' }}>
              <FlaskConical size={18} color="#9333ea" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            pH {soil?.soilPh || 6.5}
          </div>
          <p style={{ fontSize: '0.74rem', color: '#2563eb', marginTop: '4px', fontWeight: 600 }}>
            EC: {soil?.soilEcLevel || 0.5} ds/m • NPK Needs Urea
          </p>
        </div>
      </div>

      {/* Split Section: Quick Soil & Crops Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Quick Soil Widget (as in mockup) */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={18} color="#059669" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Soil Test Summary ({soil?.presentCrop || 'Sunflower'})
              </h3>
            </div>
            <button onClick={() => onNavigate('soil')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.76rem' }}>
              View Full Report
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nitrogen (N)</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                {soil?.nitrogen || 240} <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>kg/ha</span>
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem', marginTop: '4px' }}>Deficit</span>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Phosphorous (P)</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                {soil?.phosphorous || 12} <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>kg/ha</span>
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem', marginTop: '4px' }}>Deficit</span>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Potassium (K)</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                {soil?.potassium || 200} <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>kg/ha</span>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: '4px' }}>Optimal</span>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#065f46'
          }}>
            💡 <strong>Agronomist Action:</strong> Top dress with Neem-Coated Urea (85 kg/ha) prior to flowering to support head development.
          </div>
        </div>

        {/* Crops Growth Progress */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Crop Growth Stages
            </h3>
            <button onClick={() => onNavigate('crops')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.76rem' }}>
              All Crops
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {crops.slice(0, 3).map(crop => (
              <div key={crop._id} style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-body)',
                border: '1px solid var(--border-card)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <strong style={{ fontSize: '0.88rem' }}>{crop.name}</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({crop.fieldName})</span>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    {crop.stage}
                  </span>
                </div>

                <div style={{ width: '100%', height: '7px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${crop.stageProgress || 50}%`,
                    height: '100%',
                    backgroundColor: '#10b981',
                    borderRadius: '999px'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Harvest expected: {new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                  <span>{crop.stageProgress || 50}% Grown</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
