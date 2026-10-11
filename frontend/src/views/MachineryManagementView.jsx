import React, { useState, useEffect } from 'react';
import { Tractor, Plus, AlertTriangle, Wrench, Clock, Fuel, ShieldAlert, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function MachineryManagementView({ farmId }) {
  const [machines, setMachines] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMachineModal, setShowAddMachineModal] = useState(false);
  const [showLogUsageModal, setShowLogUsageModal] = useState(false);

  const [machineForm, setMachineForm] = useState({
    name: '',
    model: '',
    type: 'Tractor',
    registrationNumber: '',
    hourlyRate: 650,
    totalOperatingHours: 0,
    fuelType: 'Diesel',
    serviceIntervalHours: 150,
    nextServiceDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  });

  const [usageForm, setUsageForm] = useState({
    machineryId: '',
    cropName: 'Sunflower',
    fieldName: 'Field 1 - North Section',
    hoursRun: 4,
    fuelConsumedLiters: 12,
    fuelExpense: 1140,
    maintenanceExpense: 0,
    operatorName: 'Murugan P.',
    activityType: 'Ploughing / Deep Tilling',
    notes: ''
  });

  useEffect(() => {
    if (farmId) loadData();
  }, [farmId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, lRes, sRes] = await Promise.all([
        api.getMachineryList(farmId),
        api.getMachineryLogs(farmId),
        api.getMachineryStats(farmId)
      ]);
      setMachines(mRes);
      setLogs(lRes);
      setStats(sRes);
      if (mRes.length > 0) {
        setUsageForm(prev => ({ ...prev, machineryId: mRes[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMachine = async (e) => {
    e.preventDefault();
    try {
      await api.addMachinery({ ...machineForm, farmId });
      setShowAddMachineModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogUsage = async (e) => {
    e.preventDefault();
    try {
      await api.logMachineryUsage({ ...usageForm, farmId });
      setShowLogUsageModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading machinery fleet & operating telemetry logs...</p>
      </div>
    );
  }

  const serviceAlerts = stats?.serviceAlerts || [];

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Machinery & Equipment Fleet
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Operating hour logs, diesel fuel expenses, scheduled maintenance alerts & equipment uptime
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowAddMachineModal(true)} className="btn btn-secondary">
            <Plus size={16} />
            <span>Register Equipment</span>
          </button>
          <button onClick={() => setShowLogUsageModal(true)} className="btn btn-primary">
            <Clock size={16} />
            <span>Log Operating Hours</span>
          </button>
        </div>
      </div>

      {/* SERVICE DUE ALERT BANNER */}
      {serviceAlerts.length > 0 && (
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
              ⚠️ Scheduled Maintenance Due: {serviceAlerts.map(m => m.name).join(', ')}!
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#b91c1c', marginTop: '2px' }}>
              Equipment approaching 150-hour service milestone or service due date. Service engine oil, fuel filters and grease points to prevent field breakdown.
            </p>
          </div>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Fleet Size</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            {stats?.totalFleetCount} Units
          </div>
          <p style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            Tractors, Drone sprayers, Rotavators
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Operating Hours</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            {stats?.totalOperatingHours} Hours
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Meter telemetry aggregated
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Machinery Operating Expenses</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stats?.totalMachineryExpenses > 3000 ? '#ef4444' : '#059669', marginTop: '6px' }}>
            ₹{stats?.totalMachineryExpenses?.toLocaleString()}
          </div>
          <p style={{ fontSize: '0.74rem', color: stats?.totalMachineryExpenses > 3000 ? '#b91c1c' : '#059669', marginTop: '4px', fontWeight: 600 }}>
            Planned: ₹3,000 (Exceeded by ₹500! Highlighted on Budget)
          </p>
        </div>
      </div>

      {/* Equipment Fleet Cards */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
          Active Farm Machinery Fleet
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {machines.map((machine) => {
            const isDue = machine.maintenanceStatus === 'Service Due';
            return (
              <div 
                key={machine._id} 
                className="card" 
                style={{ 
                  padding: '20px',
                  borderLeft: isDue ? '4px solid #ef4444' : '4px solid #10b981'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{machine.name}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Model: {machine.model} • Reg: {machine.registrationNumber}
                    </div>
                  </div>
                  <span className={`badge ${isDue ? 'badge-danger' : 'badge-success'}`}>
                    {machine.maintenanceStatus}
                  </span>
                </div>

                <div style={{ margin: '14px 0', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Total Hours Run:</strong> {machine.totalOperatingHours} hrs</div>
                  <div><strong>Fuel Type:</strong> {machine.fuelType}</div>
                  <div><strong>Hourly Rental Equivalent:</strong> ₹{machine.hourlyRate} / hr</div>
                  <div><strong>Next Service Target:</strong> {machine.nextServiceDate ? new Date(machine.nextServiceDate).toLocaleDateString() : 'N/A'}</div>
                </div>

                {isDue && (
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#fee2e2',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    color: '#991b1b',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Wrench size={14} />
                    <span>150-hr Service interval reached! Book dealer technician.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Machinery Operating Logs Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Operating Hours & Expense Logs
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Diesel fuel & maintenance expense tracking
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Machine</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Activity</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Hours Run</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Fuel (L)</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Operator</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Total Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                    {log.machineryName}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="badge badge-info">{log.activityType}</span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                    {log.hoursRun} hrs
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {log.fuelConsumedLiters} L (₹{log.fuelExpense})
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    {log.operatorName}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#059669' }}>
                    ₹{log.totalExpense?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Machine Modal */}
      {showAddMachineModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Register Farm Machinery</h3>
            <form onSubmit={handleAddMachine}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Machine Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swaraj 744 FE"
                    className="input-control"
                    value={machineForm.name}
                    onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Machine Type</label>
                  <select
                    className="input-control"
                    value={machineForm.type}
                    onChange={(e) => setMachineForm({ ...machineForm, type: e.target.value })}
                  >
                    <option value="Tractor">Tractor</option>
                    <option value="Rotavator">Rotavator</option>
                    <option value="Drone Sprayer">Drone Sprayer</option>
                    <option value="Combine Harvester">Combine Harvester</option>
                    <option value="Submersible Pump">Submersible Pump</option>
                    <option value="Power Tiller">Power Tiller</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Registration / Serial No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN-38-BZ-4321"
                    className="input-control"
                    value={machineForm.registrationNumber}
                    onChange={(e) => setMachineForm({ ...machineForm, registrationNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Hourly Rate (₹)</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={machineForm.hourlyRate}
                    onChange={(e) => setMachineForm({ ...machineForm, hourlyRate: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Service Interval (Hours)</label>
                  <input
                    type="number"
                    className="input-control"
                    value={machineForm.serviceIntervalHours}
                    onChange={(e) => setMachineForm({ ...machineForm, serviceIntervalHours: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Fuel Type</label>
                  <select
                    className="input-control"
                    value={machineForm.fuelType}
                    onChange={(e) => setMachineForm({ ...machineForm, fuelType: e.target.value })}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Battery Pack">Battery Pack (Drone)</option>
                    <option value="Electric">Electric</option>
                    <option value="Petrol">Petrol</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowAddMachineModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Equipment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Operating Usage Modal */}
      {showLogUsageModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Log Machinery Operating Hours & Fuel</h3>
            <form onSubmit={handleLogUsage}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Select Equipment</label>
                  <select
                    className="input-control"
                    value={usageForm.machineryId}
                    onChange={(e) => setUsageForm({ ...usageForm, machineryId: e.target.value })}
                  >
                    {machines.map(m => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Activity Type</label>
                  <select
                    className="input-control"
                    value={usageForm.activityType}
                    onChange={(e) => setUsageForm({ ...usageForm, activityType: e.target.value })}
                  >
                    <option value="Ploughing / Deep Tilling">Ploughing / Deep Tilling</option>
                    <option value="Harrowing / Rotavation">Harrowing / Rotavation</option>
                    <option value="Bed Formation">Bed Formation</option>
                    <option value="Spraying">Spraying</option>
                    <option value="Harvesting">Harvesting</option>
                    <option value="Transport / Haulage">Transport / Haulage</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Hours Run</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    className="input-control"
                    value={usageForm.hoursRun}
                    onChange={(e) => setUsageForm({ ...usageForm, hoursRun: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Fuel Expense (₹)</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={usageForm.fuelExpense}
                    onChange={(e) => setUsageForm({ ...usageForm, fuelExpense: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Operator / Driver Name</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={usageForm.operatorName}
                    onChange={(e) => setUsageForm({ ...usageForm, operatorName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Maintenance Expense (₹)</label>
                  <input
                    type="number"
                    className="input-control"
                    value={usageForm.maintenanceExpense}
                    onChange={(e) => setUsageForm({ ...usageForm, maintenanceExpense: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowLogUsageModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Operating Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
