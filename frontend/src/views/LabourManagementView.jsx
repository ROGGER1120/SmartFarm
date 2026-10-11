import React, { useState, useEffect } from 'react';
import { Users, Plus, CheckCircle, Clock, Calendar, RefreshCw, UserCheck, Phone } from 'lucide-react';
import { api } from '../api';

export default function LabourManagementView({ farmId }) {
  const [labourers, setLabourers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddLabourModal, setShowAddLabourModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const [labourForm, setLabourForm] = useState({
    name: '',
    role: 'General Farm Hand',
    dailyWage: 500,
    phone: '+91 ',
    status: 'Active',
    assignedField: 'Field 1'
  });

  const [attForm, setAttForm] = useState({
    labourId: '',
    status: 'Present',
    taskDescription: 'Weeding and mulching along row borders',
    cropName: 'Sunflower',
    fieldName: 'Field 1 - North Section',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (farmId) loadData();
  }, [farmId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lRes, aRes, sRes] = await Promise.all([
        api.getLabourList(farmId),
        api.getAttendance(farmId),
        api.getLabourStats(farmId)
      ]);
      setLabourers(lRes);
      setAttendance(aRes);
      setStats(sRes);
      if (lRes.length > 0) {
        setAttForm(prev => ({ ...prev, labourId: lRes[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLabour = async (e) => {
    e.preventDefault();
    try {
      await api.addLabour({ ...labourForm, farmId });
      setShowAddLabourModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordAttendance = async (e) => {
    e.preventDefault();
    try {
      await api.recordAttendance({ ...attForm, farmId });
      setShowAttendanceModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading labour crew & attendance records...</p>
      </div>
    );
  }

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
            Labour Workforce & Attendance
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Worker registry, daily attendance logging, role wage rates and consolidated labour expense ledger
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowAddLabourModal(true)} className="btn btn-secondary">
            <Plus size={16} />
            <span>Add New Worker</span>
          </button>
          <button onClick={() => setShowAttendanceModal(true)} className="btn btn-primary">
            <UserCheck size={16} />
            <span>Mark Daily Attendance</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Farm Workers</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            {stats?.activeWorkers} Workers
          </div>
          <p style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            Operators, sprayers & weeders
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Recorded Working Days</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            {stats?.totalWorkingDays} Mandays
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across all fields this season
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Wages Disbursed</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
            ₹{stats?.totalWagesExpense?.toLocaleString()}
          </div>
          <p style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            Planned: ₹8,000 (Within limit: ₹7,500 spent)
          </p>
        </div>
      </div>

      {/* Workers Roster Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
          Registered Farm Hand Workers
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {labourers.map((worker) => (
            <div key={worker._id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{worker.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                    {worker.role}
                  </div>
                </div>
                <span className="badge badge-success">{worker.status}</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                <div><strong>Daily Wage Rate:</strong> ₹{worker.dailyWage} / day</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={13} color="var(--text-muted)" />
                  <span>{worker.phone}</span>
                </div>
                <div><strong>Assigned Section:</strong> {worker.assignedField}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Attendance & Daily Wage Records
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {attendance.length} attendance logs on record
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Worker Name</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Role</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Assigned Activity</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Attendance Status</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Wage Disbursed (₹)</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((att) => (
                <tr key={att._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    {new Date(att.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                    {att.labourName}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    {att.role}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {att.taskDescription}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className={`badge ${
                      att.status === 'Present' ? 'badge-success' : att.status === 'Half-Day' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {att.status} ({att.hoursWorked} hrs)
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#059669' }}>
                    ₹{att.wagePaid?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Worker Modal */}
      {showAddLabourModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add Farm Hand / Worker</h3>
            <form onSubmit={handleAddLabour}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Worker Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh K."
                    className="input-control"
                    value={labourForm.name}
                    onChange={(e) => setLabourForm({ ...labourForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Specialization Role</label>
                  <select
                    className="input-control"
                    value={labourForm.role}
                    onChange={(e) => setLabourForm({ ...labourForm, role: e.target.value })}
                  >
                    <option value="General Farm Hand">General Farm Hand</option>
                    <option value="Weeding & De-trashing">Weeding & De-trashing</option>
                    <option value="Harvesting">Harvesting</option>
                    <option value="Spraying Specialist">Spraying Specialist</option>
                    <option value="Tractor Operator">Tractor Operator</option>
                    <option value="Irrigation Handler">Irrigation Handler</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Daily Wage Rate (₹)</label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={labourForm.dailyWage}
                    onChange={(e) => setLabourForm({ ...labourForm, dailyWage: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                  <input
                    type="text"
                    className="input-control"
                    value={labourForm.phone}
                    onChange={(e) => setLabourForm({ ...labourForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowAddLabourModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Worker</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Attendance Modal */}
      {showAttendanceModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Record Daily Attendance</h3>
            <form onSubmit={handleRecordAttendance}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Select Worker</label>
                  <select
                    className="input-control"
                    value={attForm.labourId}
                    onChange={(e) => setAttForm({ ...attForm, labourId: e.target.value })}
                  >
                    {labourers.map(l => (
                      <option key={l._id} value={l._id}>
                        {l.name} ({l.role} - ₹{l.dailyWage}/day)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Attendance Status</label>
                  <select
                    className="input-control"
                    value={attForm.status}
                    onChange={(e) => setAttForm({ ...attForm, status: e.target.value })}
                  >
                    <option value="Present">Present (Full Day)</option>
                    <option value="Half-Day">Half-Day (50% Wage)</option>
                    <option value="Overtime">Overtime (130% Wage)</option>
                    <option value="Absent">Absent (0 Wage)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Task Description</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={attForm.taskDescription}
                    onChange={(e) => setAttForm({ ...attForm, taskDescription: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Date</label>
                  <input
                    type="date"
                    required
                    className="input-control"
                    value={attForm.date}
                    onChange={(e) => setAttForm({ ...attForm, date: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowAttendanceModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Record Attendance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
