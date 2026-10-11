import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Layers, Edit2, CheckCircle2, Sprout } from 'lucide-react';
import { api } from '../api';

export default function FarmManagementView({ farms, selectedFarmId, onFarmCreated }) {
  const [currentFarm, setCurrentFarm] = useState(null);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [fieldForm, setFieldForm] = useState({
    name: '',
    area: 2.0,
    soilType: 'Red Loam',
    status: 'Active Cultivation',
    currentCrop: 'Sunflower',
    cropCategory: 'Oilseed Crops'
  });

  useEffect(() => {
    const f = farms.find(farm => farm._id === selectedFarmId) || farms[0];
    setCurrentFarm(f);
  }, [farms, selectedFarmId]);

  const handleAddField = async (e) => {
    e.preventDefault();
    try {
      if (!currentFarm?._id) return;
      const res = await api.addField(currentFarm._id, fieldForm);
      setCurrentFarm(res);
      setShowAddFieldModal(false);
      setFieldForm({
        name: '',
        area: 2.0,
        soilType: 'Red Loam',
        status: 'Active Cultivation',
        currentCrop: '',
        cropCategory: 'Oilseed Crops'
      });
      if (onFarmCreated) onFarmCreated();
    } catch (err) {
      console.error(err);
    }
  };

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
            Farm & Field Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Record land acreage, define crop cultivation plots, soil classification and field zoning
          </p>
        </div>

        <button
          onClick={() => setShowAddFieldModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add New Field Plot</span>
        </button>
      </div>

      {currentFarm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Farm Details Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {currentFarm.name}
                  </h2>
                  <span className="badge badge-success">{currentFarm.code || 'FARM-01'}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  📍 {currentFarm.location} • Climate: {currentFarm.climateZone}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Cultivated Land Area</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>
                  {currentFarm.totalArea} {currentFarm.areaUnit}
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Soil Classification</span>
                <p style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentFarm.soilType}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lead Farmer / Manager</span>
                <p style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentFarm.farmerName}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Emergency Contact</span>
                <p style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentFarm.contact}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Registered Fields</span>
                <p style={{ fontSize: '0.86rem', fontWeight: 700, color: '#059669' }}>{currentFarm.fields?.length || 0} Plots</p>
              </div>
            </div>
          </div>

          {/* Field Plots Grid */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
              Field Plots & Cultivation Boundaries
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px'
            }}>
              {currentFarm.fields?.map((field, idx) => (
                <div key={idx} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={18} color="#059669" />
                      <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{field.name}</strong>
                    </div>
                    <span className="badge badge-info">{field.area} Acres</span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>
                      <strong>Current Crop:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>{field.currentCrop || 'Fallow'}</span>
                    </div>
                    <div>
                      <strong>Category:</strong> {field.cropCategory || 'General'}
                    </div>
                    <div>
                      <strong>Soil Profile:</strong> {field.soilType}
                    </div>
                    <div>
                      <strong>Plot Status:</strong> <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>{field.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add Field Plot to {currentFarm?.name}</h3>
            <form onSubmit={handleAddField}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Field Plot Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Field 5 - West Ridge"
                    className="input-control"
                    value={fieldForm.name}
                    onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Land Area (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="input-control"
                      value={fieldForm.area}
                      onChange={(e) => setFieldForm({ ...fieldForm, area: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Soil Type
                    </label>
                    <select
                      className="input-control"
                      value={fieldForm.soilType}
                      onChange={(e) => setFieldForm({ ...fieldForm, soilType: e.target.value })}
                    >
                      <option value="Red Loam">Red Loam</option>
                      <option value="Clay Loam">Clay Loam</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Alluvial Soil">Alluvial Soil</option>
                      <option value="Black Cotton Soil">Black Cotton Soil</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Crop Cultivated
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cotton / Maize"
                      className="input-control"
                      value={fieldForm.currentCrop}
                      onChange={(e) => setFieldForm({ ...fieldForm, currentCrop: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Status
                    </label>
                    <select
                      className="input-control"
                      value={fieldForm.status}
                      onChange={(e) => setFieldForm({ ...fieldForm, status: e.target.value })}
                    >
                      <option value="Active Cultivation">Active Cultivation</option>
                      <option value="Fallow">Fallow</option>
                      <option value="Ploughing">Ploughing</option>
                      <option value="Harvest Ready">Harvest Ready</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Field Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
