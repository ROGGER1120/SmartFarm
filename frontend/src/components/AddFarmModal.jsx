import React, { useState } from 'react';
import { X, Plus, MapPin } from 'lucide-react';
import { api } from '../api';

export default function AddFarmModal({ isOpen, onClose, onFarmCreated }) {
  const [form, setForm] = useState({
    name: '',
    code: 'FARM-03',
    location: '',
    totalArea: 10.0,
    areaUnit: 'Acres',
    soilType: 'Red Loamy Fertile Soil',
    farmerName: 'Farmer Arini',
    contact: '+91 98421 54321',
    climateZone: 'Tropical Semi-Arid',
    fields: [
      {
        name: 'Plot 1 - North Section',
        area: 5.0,
        soilType: 'Red Loam',
        status: 'Active Cultivation',
        currentCrop: 'Groundnut',
        cropCategory: 'Oilseed Crops'
      },
      {
        name: 'Plot 2 - South Section',
        area: 5.0,
        soilType: 'Sandy Loam',
        status: 'Ploughing',
        currentCrop: 'Maize',
        cropCategory: 'Cereals & Grains'
      }
    ]
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.createFarm(form);
      onFarmCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ padding: '28px', maxWidth: '640px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Create New Farm
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Register farm property, acreage units and default cultivation plots
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Farm Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Farm 3 - Nilgiri Terrace"
                className="input-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Farm Code
              </label>
              <input
                type="text"
                required
                className="input-control"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Total Land Area (Acres)
              </label>
              <input
                type="number"
                step="0.5"
                required
                className="input-control"
                value={form.totalArea}
                onChange={(e) => setForm({ ...form, totalArea: Number(e.target.value) })}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Location / Taluk / District
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mettupalayam, Coimbatore, Tamil Nadu"
                className="input-control"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Soil Classification
              </label>
              <select
                className="input-control"
                value={form.soilType}
                onChange={(e) => setForm({ ...form, soilType: e.target.value })}
              >
                <option value="Red Loamy Fertile Soil">Red Loamy Fertile Soil</option>
                <option value="Alluvial River Delta Soil">Alluvial River Delta Soil</option>
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Clayey Loam">Clayey Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Climate Zone
              </label>
              <input
                type="text"
                className="input-control"
                value={form.climateZone}
                onChange={(e) => setForm({ ...form, climateZone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Creating Farm...' : 'Create Farm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
