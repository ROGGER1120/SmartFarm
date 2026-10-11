import React from 'react';
import { X, AlertTriangle, ShieldAlert, Droplet, Package, Tractor, DollarSign, ArrowRight } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, onNavigate, budgetData, fertilizerStats, waterMetrics, machineryStats }) {
  if (!isOpen) return null;

  const exceededCategories = budgetData?.exceededCategories || [];
  const lowStockItems = fertilizerStats?.lowStockItems || [];
  const abnormalLogs = waterMetrics?.recentAbnormalLogs || [];
  const serviceAlerts = machineryStats?.serviceAlerts || [];

  const totalAlerts = exceededCategories.length + lowStockItems.length + abnormalLogs.length + serviceAlerts.length;

  return (
    <div className="modal-backdrop" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100vh',
          backgroundColor: 'var(--bg-card)',
          boxShadow: '-4px 0 25px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1100,
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="#ef4444" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Active Farm Alerts ({totalAlerts})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. Over Budget Alerts */}
          {exceededCategories.map((cat, idx) => (
            <div 
              key={`bgt-${idx}`}
              onClick={() => { onNavigate('budget'); onClose(); }}
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'transform 0.1s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-danger">Budget Exceeded</span>
                <span style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700 }}>+{cat.variancePercentage}%</span>
              </div>
              <strong style={{ fontSize: '0.92rem', color: '#991b1b' }}>
                {cat.category} Overrun: +₹{cat.variance.toLocaleString()}
              </strong>
              <p style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '4px' }}>
                Planned: ₹{cat.planned.toLocaleString()} • Actual: ₹{cat.actual.toLocaleString()}
              </p>
            </div>
          ))}

          {/* 2. Low Fertilizer Stock Alerts */}
          {lowStockItems.map((item, idx) => (
            <div 
              key={`fert-${idx}`}
              onClick={() => { onNavigate('fertilizer'); onClose(); }}
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '14px 16px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-warning">Low Fertilizer Stock</span>
                <span style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 700 }}>Reorder Alert</span>
              </div>
              <strong style={{ fontSize: '0.92rem', color: '#92400e' }}>
                {item.name}
              </strong>
              <p style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '4px' }}>
                Current stock is {item.currentStock} {item.unit} (Safety Threshold: {item.minThresholdStock} {item.unit})
              </p>
            </div>
          ))}

          {/* 3. Machinery Service Due Alerts */}
          {serviceAlerts.map((mach, idx) => (
            <div 
              key={`mach-${idx}`}
              onClick={() => { onNavigate('machinery'); onClose(); }}
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '14px 16px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-danger">Service Due</span>
                <span style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700 }}>Maintenance</span>
              </div>
              <strong style={{ fontSize: '0.92rem', color: '#991b1b' }}>
                {mach.name}
              </strong>
              <p style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '4px' }}>
                Total hours run: {mach.totalOperatingHours} hrs (150-hr interval milestone).
              </p>
            </div>
          ))}

          {/* 4. Abnormal Water Leak Alert */}
          {abnormalLogs.map((log, idx) => (
            <div 
              key={`wat-${idx}`}
              onClick={() => { onNavigate('water'); onClose(); }}
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '14px 16px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-danger">Abnormal Water Flow</span>
                <span style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700 }}>Leak Flag</span>
              </div>
              <strong style={{ fontSize: '0.92rem', color: '#991b1b' }}>
                {log.cropName} ({log.fieldName})
              </strong>
              <p style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '4px' }}>
                {log.abnormalReason || `Used ${log.quantityLiters.toLocaleString()} L vs ${log.plannedLiters.toLocaleString()} L planned`}
              </p>
            </div>
          ))}

          {totalAlerts === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <ShieldAlert size={36} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <p>No active anomalies or warnings! All resources are operating within planned benchmarks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
