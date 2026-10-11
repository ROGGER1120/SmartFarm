import React, { useState, useEffect } from 'react';
import { Droplet, Plus, AlertTriangle, Calendar, Clock, CheckCircle2, TrendingUp, RefreshCw, ShieldAlert } from 'lucide-react';
import { api } from '../api';

export default function WaterManagementView({ farmId }) {
  const [logs, setLogs] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [logForm, setLogForm] = useState({
    cropName: 'Sunflower',
    fieldName: 'Field 1 - North Section',
    source: 'Drip System',
    durationHours: 3.0,
    quantityLiters: 12000,
    plannedLiters: 10000,
    cost: 500,
    notes: ''
  });

  const [scheduleForm, setScheduleForm] = useState({
    cropName: 'Sunflower',
    fieldName: 'Field 1 - North Section',
    frequency: 'Alternate Days',
    irrigationTime: '06:30 AM',
    durationMinutes: 90,
    plannedLiters: 12000,
    method: 'Drip Line',
    valveZone: 'Zone A - Solar Drip'
  });

  useEffect(() => {
    if (farmId) loadWaterData();
  }, [farmId]);

  const loadWaterData = async () => {
    try {
      setLoading(true);
      const [lRes, sRes, mRes] = await Promise.all([
        api.getWaterLogs(farmId),
        api.getIrrigationSchedules(farmId),
        api.getWaterMetrics(farmId)
      ]);
      setLogs(lRes);
      setSchedules(sRes);
      setMetrics(mRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      await api.addWaterLog({ ...logForm, farmId });
      setShowLogModal(false);
      await loadWaterData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      await api.addIrrigationSchedule({ ...scheduleForm, farmId });
      setShowScheduleModal(false);
      await loadWaterData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading water usage logs and irrigation schedules...</p>
      </div>
    );
  }

  const abnormalLogs = logs.filter(l => l.abnormalFlag);

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
            Water & Irrigation Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Smart metering, irrigation scheduling, water expenses, and automated leak / abnormal consumption alerts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="btn btn-secondary"
          >
            <Clock size={16} />
            <span>Set Schedule</span>
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Log Water Usage</span>
          </button>
        </div>
      </div>

      {/* ANOMALY DETECTION ALERT BANNER */}
      {abnormalLogs.length > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <ShieldAlert size={26} color="#ef4444" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#991b1b' }}>
              ⚠️ Unusually High Water Consumption Detected! ({abnormalLogs.length} Events)
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#b91c1c', marginTop: '2px' }}>
              Actual water usage surpassed 120% of planned irrigation quota. Possible sub-lateral valve leak or pressure regulator malfunction.
            </p>
          </div>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Water Consumed</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            {metrics?.totalActualLiters?.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Litres</span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Planned: {metrics?.totalPlannedLiters?.toLocaleString()} L
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Water Expenses</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: metrics?.totalWaterCost > 2000 ? '#ef4444' : '#059669', marginTop: '6px' }}>
            ₹{metrics?.totalWaterCost?.toLocaleString()}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Budget Allocation: ₹2,000 (Exceeded by ₹500!)
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Usage vs Planned Variance</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: metrics?.varianceLiters > 0 ? '#ef4444' : '#059669', marginTop: '6px' }}>
            {metrics?.varianceLiters > 0 ? `+${metrics?.varianceLiters.toLocaleString()}` : `${metrics?.varianceLiters.toLocaleString()}`} L
          </div>
          <p style={{ fontSize: '0.74rem', color: metrics?.varianceLiters > 0 ? '#b91c1c' : '#047857', marginTop: '4px', fontWeight: 600 }}>
            {metrics?.variancePercentage > 0 ? `+${metrics?.variancePercentage}% Higher Consumption` : 'Optimal'}
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Irrigation Schedules</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
            {schedules.length} Zones
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Drip Lines & Micro-Sprinklers
          </p>
        </div>
      </div>

      {/* Schedules Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
          Active Irrigation Timers & Schedules
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {schedules.map((sch) => (
            <div key={sch._id} className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong style={{ fontSize: '0.95rem' }}>{sch.cropName}</strong>
                <span className="badge badge-success">{sch.status}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Field:</strong> {sch.fieldName} ({sch.valveZone})</div>
                <div><strong>Method:</strong> {sch.method}</div>
                <div><strong>Timing:</strong> {sch.irrigationTime} • {sch.durationMinutes} Mins</div>
                <div><strong>Target:</strong> {sch.plannedLiters?.toLocaleString()} Litres ({sch.frequency})</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Water Usage History Table with Anomaly Highlighting */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Recorded Water Usage Logs & Anomaly Detection
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Flags auto-triggered when actual &gt; 120% of planned
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Crop / Field</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Method / Source</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Planned (L)</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Actual (L)</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Cost (₹)</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Anomaly Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: log.abnormalFlag ? 'rgba(239, 68, 68, 0.08)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                    {log.cropName} ({log.fieldName})
                  </td>
                  <td style={{ padding: '14px 18px' }}>{log.source} ({log.durationHours} hrs)</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                    {log.plannedLiters?.toLocaleString()} L
                  </td>
                  <td style={{
                    padding: '14px 18px',
                    fontWeight: 700,
                    color: log.abnormalFlag ? '#ef4444' : 'var(--text-main)'
                  }}>
                    {log.quantityLiters?.toLocaleString()} L
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                    ₹{log.cost?.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {log.abnormalFlag ? (
                      <div>
                        <span className="badge badge-danger">High Consumption!</span>
                        {log.abnormalReason && (
                          <div style={{ fontSize: '0.72rem', color: '#b91c1c', marginTop: '4px' }}>
                            {log.abnormalReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="badge badge-success">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Water Log Modal */}
      {showLogModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Log Water Consumption</h3>
            <form onSubmit={handleAddLog}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Crop Name</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={logForm.cropName}
                    onChange={(e) => setLogForm({ ...logForm, cropName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Source</label>
                  <select
                    className="input-control"
                    value={logForm.source}
                    onChange={(e) => setLogForm({ ...logForm, source: e.target.value })}
                  >
                    <option value="Drip System">Drip System</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Canal Irrigation">Canal Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Farm Pond">Farm Pond</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    className="input-control"
                    value={logForm.durationHours}
                    onChange={(e) => setLogForm({ ...logForm, durationHours: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Planned Litres</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={logForm.plannedLiters}
                    onChange={(e) => setLogForm({ ...logForm, plannedLiters: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Actual Litres Consumed</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={logForm.quantityLiters}
                    onChange={(e) => setLogForm({ ...logForm, quantityLiters: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Power / Water Cost (₹)</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={logForm.cost}
                    onChange={(e) => setLogForm({ ...logForm, cost: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Water Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Irrigation Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Set Irrigation Schedule</h3>
            <form onSubmit={handleAddSchedule}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Crop</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={scheduleForm.cropName}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, cropName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Frequency</label>
                  <select
                    className="input-control"
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Alternate Days">Alternate Days</option>
                    <option value="Every 3 Days">Every 3 Days</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Start Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 AM"
                    className="input-control"
                    value={scheduleForm.irrigationTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, irrigationTime: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Duration (Minutes)</label>
                  <input
                    type="number"
                    className="input-control"
                    value={scheduleForm.durationMinutes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, durationMinutes: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Litres</label>
                  <input
                    type="number"
                    className="input-control"
                    value={scheduleForm.plannedLiters}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, plannedLiters: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Irrigation Method</label>
                  <select
                    className="input-control"
                    value={scheduleForm.method}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, method: e.target.value })}
                  >
                    <option value="Drip Line">Drip Line</option>
                    <option value="Micro-Sprinkler">Micro-Sprinkler</option>
                    <option value="Furrow Flood">Furrow Flood</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
