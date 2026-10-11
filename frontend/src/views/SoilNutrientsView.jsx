import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Plus, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  MapPin, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { api } from '../api';

export default function SoilNutrientsView({ farmId, onNavigateToBudget }) {
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryText, setSummaryText] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (farmId) {
      loadSoilData();
    }
  }, [farmId]);

  const loadSoilData = async () => {
    try {
      setLoading(true);
      const data = await api.getSoilReport(farmId);
      setReport(data);
      if (data) {
        setEditForm(data);
      }
    } catch (err) {
      console.error('Failed to load soil report', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);
      const res = await api.generateSoilSummary(farmId);
      setSummaryText(res.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateReport = async (e) => {
    e.preventDefault();
    try {
      if (report?._id) {
        const updated = await api.updateSoilReport(report._id, editForm);
        setReport(updated);
        setShowUpdateModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading soil parameters and nutrient analysis...</p>
      </div>
    );
  }

  const subTabs = ['Overview', 'Nutrient Recommendations', 'Nutrient History', 'Resources'];

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Soil and Nutrients Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time soil health benchmarks, NPK deficit monitoring & precision fertigation guidance
          </p>
        </div>

        <button
          onClick={() => setShowUpdateModal(true)}
          style={{
            backgroundColor: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fde68a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
        >
          <Plus size={16} />
          <span>Add new test report</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '24px'
      }}>
        {subTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              padding: '12px 2px',
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === tab ? '3px solid #059669' : '3px solid transparent',
              color: activeSubTab === tab ? '#059669' : 'var(--text-secondary)',
              fontWeight: activeSubTab === tab ? 700 : 500,
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Summary Message Banner (if generated) */}
      {summaryText && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Sparkles size={20} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.92rem', color: '#065f46', marginBottom: '4px' }}>Agronomist AI Analysis Summary</h4>
            <p style={{ fontSize: '0.85rem', color: '#047857', lineHeight: 1.5 }}>{summaryText}</p>
          </div>
          <button
            onClick={() => setSummaryText(null)}
            style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Soil Test Analysis Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
        {/* Card Header Bar */}
        <div style={{
          padding: '14px 24px',
          backgroundColor: '#e6f4ea',
          borderBottom: '1px solid #d1e7dd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FlaskConical size={20} color="#059669" />
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f5132' }}>
              Soil Test Analysis
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              style={{
                backgroundColor: '#ffffff',
                color: '#0f5132',
                border: '1px solid #badbcc',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} color="#059669" />
              <span>{isGenerating ? 'Analyzing...' : 'Generate summary'}</span>
            </button>

            <button
              onClick={() => setShowUpdateModal(true)}
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Update Soil Test</span>
              <Info size={14} />
            </button>
          </div>
        </div>

        {/* Card Content: Split Layout matching Screenshot */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 340px) 1fr',
          gap: '24px',
          padding: '24px'
        }}>
          {/* Left Side: Present Crop & Satellite Field View */}
          <div style={{
            borderRight: '1px solid var(--border-card)',
            paddingRight: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Present Crop
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {report?.presentCrop || 'Sunflower'}
                </h2>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e'
                }}>
                  {report?.cropCategory || 'Oilseed Crops'}
                </span>
              </div>
            </div>

            {/* Satellite Field Graphic matching the mockup */}
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              height: '220px',
              background: '#1b3b22'
            }}>
              {/* Field Satellite Canvas Graphic */}
              <svg width="100%" height="100%" viewBox="0 0 400 280" style={{ display: 'block' }}>
                <defs>
                  {/* Agricultural Field Texture */}
                  <pattern id="cropField" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
                    <rect width="20" height="20" fill="#2d5a37" />
                    <line x1="0" y1="0" x2="0" y2="20" stroke="#1f4427" strokeWidth="3" />
                  </pattern>
                  <pattern id="cropRows" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
                    <rect width="16" height="16" fill="#386b45" />
                    <line x1="0" y1="0" x2="16" y2="0" stroke="#254d30" strokeWidth="2" />
                  </pattern>
                </defs>

                {/* Surrounding Farm Plots */}
                <rect width="400" height="280" fill="url(#cropField)" />
                <path d="M 0 160 L 400 240 L 400 280 L 0 280 Z" fill="url(#cropRows)" opacity="0.85" />
                <path d="M 0 0 L 140 0 L 110 120 L 0 100 Z" fill="#264e31" />
                <path d="M 270 0 L 400 0 L 400 130 L 260 90 Z" fill="#305a39" />

                {/* Highlighted Plot Boundary (As shown in screenshot purple translucent zone) */}
                <polygon 
                  points="130,40 280,70 240,210 110,180" 
                  fill="#7c3aed" 
                  fillOpacity="0.55" 
                  stroke="#a78bfa" 
                  strokeWidth="3.5" 
                />

                {/* Plot Marker Pin */}
                <circle cx="195" cy="120" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                <text x="195" y="148" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                  sunflower
                </text>

                {/* North Compass Indicator */}
                <g transform="translate(365, 30)">
                  <circle cx="0" cy="0" r="16" fill="rgba(0,0,0,0.5)" />
                  <path d="M 0 -11 L 4 5 L 0 1 L -4 5 Z" fill="#ef4444" />
                  <text x="0" y="-13" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">N</text>
                </g>
              </svg>

              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                fontSize: '0.72rem',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <MapPin size={12} color="#34d399" />
                <span>Field 1 • 3.5 Acres Plot</span>
              </div>
            </div>
          </div>

          {/* Right Side: 2x3 Metric Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {/* 1. Soil Ph */}
            <div style={{
              backgroundColor: 'var(--bg-body)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Soil Ph</span>
                <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                  {report?.soilPhBenchmark || '0 to 14'}
                </p>
              </div>
              <div style={{ marginTop: '14px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  {report?.soilPh}
                </span>
                <span style={{ marginLeft: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                  Optimal
                </span>
              </div>
            </div>

            {/* 2. Soil EC Level */}
            <div style={{
              backgroundColor: 'var(--bg-body)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Soil EC Level</span>
                <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                  {report?.soilEcBenchmark || '<1 ds/m'}
                </p>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  {report?.soilEcLevel}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  ds/m
                </span>
              </div>
            </div>

            {/* 3. Organic Carbon */}
            <div style={{
              backgroundColor: 'var(--bg-body)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Organic Carbon</span>
                <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                  {report?.organicCarbonBenchmark || '(0.5 to 0.75%)'}
                </p>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  {report?.organicCarbon}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>
                  %
                </span>
              </div>
            </div>

            {/* 4. Nitrogen (N) */}
            <div style={{
              backgroundColor: 'var(--bg-body)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nitrogen (N)</span>
                <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                  {report?.nitrogenBenchmark || '(280 to 560 kg/ha)'}
                </p>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.03em' }}>
                  {report?.nitrogen}
                </span>
                <span className="badge badge-warning">Deficit</span>
              </div>
            </div>

            {/* 5. Phosphorous (P) */}
            <div style={{
              backgroundColor: 'var(--bg-body)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Phosphorous (P)</span>
                <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                  {report?.phosphorousBenchmark || '(22.5 to 56 kg/ha)'}
                </p>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.03em' }}>
                  {report?.phosphorous}
                </span>
                <span className="badge badge-warning">Deficit</span>
              </div>
            </div>

            {/* 6. Potassium (K) */}
            <div style={{
              backgroundColor: 'var(--bg-body)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Potassium (K)</span>
                <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                  {report?.potassiumBenchmark || '(120 to 280 kg/ha)'}
                </p>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#059669', letterSpacing: '-0.03em' }}>
                  {report?.potassium}
                </span>
                <span className="badge badge-success">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrient Recommendations Section */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Nutrient Recommendations
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Targeted fertilizer dosage recommendations based on soil chemical deficiency tests
            </p>
          </div>

          <button
            onClick={onNavigateToBudget}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            <span>Check Cultivation Budget</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {report?.recommendations?.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: item.priority === 'High' ? '#ef4444' : item.priority === 'Medium' ? '#f59e0b' : '#10b981'
                  }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.nutrient}
                  </h4>
                </div>
                <span className={`badge ${item.priority === 'High' ? 'badge-danger' : item.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                  {item.priority} Priority
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <strong>Status:</strong> {item.deficiencyLevel}
              </p>

              <div style={{
                backgroundColor: 'var(--bg-body)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '0.84rem',
                color: 'var(--text-main)',
                lineHeight: 1.45
              }}>
                <span style={{ fontWeight: 600, color: '#059669', display: 'block', marginBottom: '2px' }}>
                  Application Action:
                </span>
                {item.suggestedFertilizer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Soil Test Modal */}
      {showUpdateModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Update Soil Test Parameters</h3>
            <form onSubmit={handleUpdateReport}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Present Crop
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    value={editForm.presentCrop || ''}
                    onChange={(e) => setEditForm({ ...editForm, presentCrop: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Soil Ph (0-14)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-control"
                    value={editForm.soilPh || 6.5}
                    onChange={(e) => setEditForm({ ...editForm, soilPh: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    EC Level (ds/m)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    className="input-control"
                    value={editForm.soilEcLevel || 0.5}
                    onChange={(e) => setEditForm({ ...editForm, soilEcLevel: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Organic Carbon (%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    className="input-control"
                    value={editForm.organicCarbon || 0.8}
                    onChange={(e) => setEditForm({ ...editForm, organicCarbon: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Nitrogen N (kg/ha)
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={editForm.nitrogen || 240}
                    onChange={(e) => setEditForm({ ...editForm, nitrogen: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Phosphorous P (kg/ha)
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={editForm.phosphorous || 12}
                    onChange={(e) => setEditForm({ ...editForm, phosphorous: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Potassium K (kg/ha)
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={editForm.potassium || 200}
                    onChange={(e) => setEditForm({ ...editForm, potassium: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
