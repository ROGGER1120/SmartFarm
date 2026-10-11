import React, { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle, CheckCircle2, TrendingUp, RefreshCw, ShoppingCart, ShieldAlert } from 'lucide-react';
import { api } from '../api';

export default function FertilizerView({ farmId }) {
  const [fertilizers, setFertilizers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [stockForm, setStockForm] = useState({
    name: '',
    category: 'NPK Complex',
    currentStock: 10,
    unit: 'Bags (50kg)',
    minThresholdStock: 4,
    pricePerUnit: 1400,
    npkRatio: '19:19:19',
    supplier: 'IFFCO'
  });

  const [applyForm, setApplyForm] = useState({
    fertilizerId: '',
    cropName: 'Sunflower',
    fieldName: 'Field 1 - North Section',
    quantityUsed: 2,
    applicationMethod: 'Basal Dressing',
    notes: ''
  });

  useEffect(() => {
    if (farmId) loadData();
  }, [farmId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fRes, lRes, sRes] = await Promise.all([
        api.getFertilizers(farmId),
        api.getFertilizerLogs(farmId),
        api.getFertilizerStats(farmId)
      ]);
      setFertilizers(fRes);
      setLogs(lRes);
      setStats(sRes);
      if (fRes.length > 0) {
        setApplyForm(prev => ({ ...prev, fertilizerId: fRes[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await api.addFertilizer({ ...stockForm, farmId });
      setShowAddStockModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.logFertilizerApplication({ ...applyForm, farmId });
      setShowApplyModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading fertilizer inventory & dosage records...</p>
      </div>
    );
  }

  const lowStockItems = fertilizers.filter(f => f.currentStock <= f.minThresholdStock);

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
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Fertilizer Inventory & Nutrient Application
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Track fertilizer warehouse stock, set reorder threshold alerts, log field applications & calculate expenses
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowAddStockModal(true)} className="btn btn-secondary">
            <ShoppingCart size={16} />
            <span>Record Purchase / Stock</span>
          </button>
          <button onClick={() => setShowApplyModal(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Log Field Application</span>
          </button>
        </div>
      </div>

      {/* LOW STOCK ALERT BANNER */}
      {lowStockItems.length > 0 && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <ShieldAlert size={26} color="#d97706" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#92400e' }}>
              ⚠️ Low Fertilizer Stock Warning: {lowStockItems.length} Products Below Reorder Level!
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#b45309', marginTop: '2px' }}>
              {lowStockItems.map(i => `${i.name} (Current: ${i.currentStock} ${i.unit}, Min: ${i.minThresholdStock})`).join(' • ')}
            </p>
          </div>
        </div>
      )}

      {/* 3 Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Warehouse Stock Value</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            ₹{stats?.totalInventoryValue?.toLocaleString()}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {fertilizers.length} Fertilizer SKUs Registered
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Applied Fertilizer Expenses</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
            ₹{stats?.totalAppliedExpense?.toLocaleString()}
          </div>
          <p style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            Within Budget Planned (₹5,000 allocated • ₹4,500 spent)
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stock Alerts</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: lowStockItems.length > 0 ? '#f59e0b' : '#059669', marginTop: '6px' }}>
            {lowStockItems.length > 0 ? `${lowStockItems.length} Low Stock` : 'Healthy Inventory'}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {lowStockItems.length > 0 ? 'Reorder advised before next fertigation' : 'All stocks above safety threshold'}
          </p>
        </div>
      </div>

      {/* Fertilizer Inventory Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
          Current Fertilizer Stock & Inventory Levels
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {fertilizers.map((item) => {
            const isLow = item.currentStock <= item.minThresholdStock;
            return (
              <div 
                key={item._id} 
                className="card" 
                style={{ 
                  padding: '20px',
                  borderLeft: isLow ? '4px solid #f59e0b' : '4px solid #10b981'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{item.name}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Category: {item.category} • NPK: {item.npkRatio}
                    </div>
                  </div>
                  <span className={`badge ${isLow ? 'badge-warning' : 'badge-success'}`}>
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>

                <div style={{ margin: '14px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Current Stock:</span>
                    <strong style={{ color: isLow ? '#d97706' : 'var(--text-main)' }}>
                      {item.currentStock} {item.unit}
                    </strong>
                  </div>

                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, (item.currentStock / 15) * 100)}%`,
                      height: '100%',
                      backgroundColor: isLow ? '#f59e0b' : '#10b981',
                      borderRadius: '999px'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px', textAlign: 'right' }}>
                    Min Threshold: {item.minThresholdStock} {item.unit}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <span>Price: ₹{item.pricePerUnit?.toLocaleString()} / {item.unit}</span>
                  <span>Supplier: {item.supplier}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Logs Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Recorded Field Application Logs & Expenses
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Auto deducted from warehouse stock upon logging
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Fertilizer Applied</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Target Crop / Field</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Quantity Used</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Application Method</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Total Expense (₹)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                    {log.fertilizerName}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {log.cropName} ({log.fieldName})
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                    {log.quantityUsed} {log.unit}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="badge badge-info">{log.applicationMethod}</span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#059669' }}>
                    ₹{log.totalCost?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add Fertilizer Stock Purchase</h3>
            <form onSubmit={handleAddStock}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Fertilizer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muriate of Potash (MOP)"
                    className="input-control"
                    value={stockForm.name}
                    onChange={(e) => setStockForm({ ...stockForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    className="input-control"
                    value={stockForm.category}
                    onChange={(e) => setStockForm({ ...stockForm, category: e.target.value })}
                  >
                    <option value="Nitrogenous (N)">Nitrogenous (N)</option>
                    <option value="Phosphatic (P)">Phosphatic (P)</option>
                    <option value="Potassic (K)">Potassic (K)</option>
                    <option value="NPK Complex">NPK Complex</option>
                    <option value="Organic Compost">Organic Compost</option>
                    <option value="Bio-Fertilizer">Bio-Fertilizer</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Purchased Stock</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={stockForm.currentStock}
                    onChange={(e) => setStockForm({ ...stockForm, currentStock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Unit</label>
                  <select
                    className="input-control"
                    value={stockForm.unit}
                    onChange={(e) => setStockForm({ ...stockForm, unit: e.target.value })}
                  >
                    <option value="Bags (50kg)">Bags (50kg)</option>
                    <option value="Kg">Kg</option>
                    <option value="Liters">Liters</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Min Threshold Alert</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={stockForm.minThresholdStock}
                    onChange={(e) => setStockForm({ ...stockForm, minThresholdStock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Price Per Unit (₹)</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={stockForm.pricePerUnit}
                    onChange={(e) => setStockForm({ ...stockForm, pricePerUnit: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowAddStockModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save to Inventory</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Application Modal */}
      {showApplyModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Log Fertilizer Field Application</h3>
            <form onSubmit={handleApply}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Select Fertilizer</label>
                  <select
                    className="input-control"
                    value={applyForm.fertilizerId}
                    onChange={(e) => setApplyForm({ ...applyForm, fertilizerId: e.target.value })}
                  >
                    {fertilizers.map(f => (
                      <option key={f._id} value={f._id}>
                        {f.name} (Stock: {f.currentStock} {f.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Crop</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={applyForm.cropName}
                    onChange={(e) => setApplyForm({ ...applyForm, cropName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Quantity to Apply</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    className="input-control"
                    value={applyForm.quantityUsed}
                    onChange={(e) => setApplyForm({ ...applyForm, quantityUsed: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Application Method</label>
                  <select
                    className="input-control"
                    value={applyForm.applicationMethod}
                    onChange={(e) => setApplyForm({ ...applyForm, applicationMethod: e.target.value })}
                  >
                    <option value="Basal Dressing">Basal Dressing</option>
                    <option value="Top Dressing">Top Dressing</option>
                    <option value="Fertigation (Drip)">Fertigation (Drip)</option>
                    <option value="Foliar Spray">Foliar Spray</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Apply & Deduct Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
