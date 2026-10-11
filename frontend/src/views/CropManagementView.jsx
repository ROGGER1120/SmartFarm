import React, { useState, useEffect } from 'react';
import { Sprout, Plus, CheckCircle, Clock, Calendar, ArrowRight, Award, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function CropManagementView({ farmId }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showYieldModal, setShowYieldModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [cropForm, setCropForm] = useState({
    name: '',
    variety: '',
    category: 'Oilseed Crops',
    season: 'Kharif',
    fieldName: 'Field 1 - North Section',
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    areaCultivated: 3.0,
    estimatedYield: 30,
    yieldUnit: 'Quintals',
    marketPricePerUnit: 5000
  });

  const [yieldForm, setYieldForm] = useState({
    actualYield: 32,
    yieldUnit: 'Quintals',
    actualRevenue: 187200,
    actualHarvestDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (farmId) loadCrops();
  }, [farmId]);

  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await api.getCrops(farmId);
      setCrops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCrop = async (e) => {
    e.preventDefault();
    try {
      await api.createCrop({ ...cropForm, farmId });
      setShowAddModal(false);
      await loadCrops();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStageAdvance = async (crop) => {
    const stages = [
      'Land Preparation', 
      'Sowing / Seedling', 
      'Vegetative Growth', 
      'Flowering & Budding', 
      'Grain / Pod Formation', 
      'Maturity', 
      'Harvested'
    ];
    const currentIdx = stages.indexOf(crop.stage);
    if (currentIdx < stages.length - 1) {
      const nextStage = stages[currentIdx + 1];
      const newProgress = Math.min(100, Math.round(((currentIdx + 2) / stages.length) * 100));
      await api.updateCropStage(crop._id, { stage: nextStage, stageProgress: newProgress });
      await loadCrops();
    }
  };

  const handleRecordYield = async (e) => {
    e.preventDefault();
    try {
      if (!selectedCrop) return;
      await api.recordCropYield(selectedCrop._id, yieldForm);
      setShowYieldModal(false);
      await loadCrops();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading crop cultivation lifecycle records...</p>
      </div>
    );
  }

  const stages = [
    'Land Preparation', 
    'Sowing / Seedling', 
    'Vegetative Growth', 
    'Flowering & Budding', 
    'Grain / Pod Formation', 
    'Maturity', 
    'Harvested'
  ];

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
            Crop Cultivation & Lifecycle Tracker
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Monitor crop phenological stages, expected harvest countdown and post-harvest yield revenue
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add New Crop</span>
        </button>
      </div>

      {/* Crops List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {crops.map((crop) => (
          <div key={crop._id} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {crop.name}
                  </h2>
                  <span className="badge badge-warning">{crop.category}</span>
                  <span className="badge badge-info">{crop.season}</span>
                  <span className={`badge ${crop.status === 'Harvested' ? 'badge-success' : 'badge-info'}`}>
                    {crop.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Variety: <strong>{crop.variety}</strong> • Plot: <strong>{crop.fieldName}</strong> ({crop.areaCultivated} Acres)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {crop.status !== 'Harvested' ? (
                  <>
                    <button
                      onClick={() => handleStageAdvance(crop)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      <span>Advance Stage</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCrop(crop);
                        setShowYieldModal(true);
                      }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      <Award size={14} />
                      <span>Record Harvest Yield</span>
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success">Harvest Completed</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                      Revenue: ₹{crop.actualRevenue?.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Growth Stages Stepper */}
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>
                  Current Stage: {crop.stage} ({crop.stageProgress}%)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Sown: {new Date(crop.sowingDate).toLocaleDateString()} • Expected Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                </span>
              </div>

              {/* Visual Stage Timeline Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${stages.length}, 1fr)`,
                gap: '4px',
                height: '10px',
                borderRadius: '999px',
                overflow: 'hidden',
                backgroundColor: '#e2e8f0'
              }}>
                {stages.map((stageName, sIdx) => {
                  const currentIdx = stages.indexOf(crop.stage);
                  const isDone = sIdx <= currentIdx;
                  return (
                    <div
                      key={stageName}
                      title={stageName}
                      style={{
                        backgroundColor: isDone ? '#10b981' : 'transparent',
                        height: '100%',
                        transition: 'background-color 0.3s ease'
                      }}
                    />
                  );
                })}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                marginTop: '6px'
              }}>
                <span>Sowing</span>
                <span>Vegetative</span>
                <span>Flowering</span>
                <span>Grain Filling</span>
                <span>Maturity</span>
                <span>Harvest</span>
              </div>
            </div>

            {/* Yield & Economics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              backgroundColor: 'var(--bg-body)',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Yield:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                  {crop.estimatedYield} {crop.yieldUnit}
                </div>
              </div>

              {crop.actualYield > 0 && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Recorded Actual Yield:</span>
                  <div style={{ fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                    {crop.actualYield} {crop.yieldUnit}
                  </div>
                </div>
              )}

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Expected Market Rate:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                  ₹{crop.marketPricePerUnit?.toLocaleString()} / {crop.yieldUnit}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Crop Health Index:</span>
                <div style={{ fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                  {crop.healthStatus || 'Good'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add New Crop</h3>
            <form onSubmit={handleCreateCrop}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Groundnut / Cotton"
                    className="input-control"
                    value={cropForm.name}
                    onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Variety</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TMV-7 / BT-2"
                    className="input-control"
                    value={cropForm.variety}
                    onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    className="input-control"
                    value={cropForm.category}
                    onChange={(e) => setCropForm({ ...cropForm, category: e.target.value })}
                  >
                    <option value="Oilseed Crops">Oilseed Crops</option>
                    <option value="Cereals & Grains">Cereals & Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Commercial Crops">Commercial Crops</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Season</label>
                  <select
                    className="input-control"
                    value={cropForm.season}
                    onChange={(e) => setCropForm({ ...cropForm, season: e.target.value })}
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Sowing Date</label>
                  <input
                    type="date"
                    required
                    className="input-control"
                    value={cropForm.sowingDate}
                    onChange={(e) => setCropForm({ ...cropForm, sowingDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Expected Harvest Date</label>
                  <input
                    type="date"
                    required
                    className="input-control"
                    value={cropForm.expectedHarvestDate}
                    onChange={(e) => setCropForm({ ...cropForm, expectedHarvestDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Estimated Yield (Quintals)</label>
                  <input
                    type="number"
                    className="input-control"
                    value={cropForm.estimatedYield}
                    onChange={(e) => setCropForm({ ...cropForm, estimatedYield: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Expected Price / Unit (₹)</label>
                  <input
                    type="number"
                    className="input-control"
                    value={cropForm.marketPricePerUnit}
                    onChange={(e) => setCropForm({ ...cropForm, marketPricePerUnit: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Crop Details</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Harvest Modal */}
      {showYieldModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
              Record Harvest & Yield for {selectedCrop?.name}
            </h3>
            <form onSubmit={handleRecordYield}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Actual Yield ({selectedCrop?.yieldUnit || 'Quintals'})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    className="input-control"
                    value={yieldForm.actualYield}
                    onChange={(e) => {
                      const y = Number(e.target.value);
                      const rev = Math.round(y * (selectedCrop?.marketPricePerUnit || 5000));
                      setYieldForm({ ...yieldForm, actualYield: y, actualRevenue: rev });
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Actual Revenue Realized (₹)
                  </label>
                  <input
                    type="number"
                    required
                    className="input-control"
                    value={yieldForm.actualRevenue}
                    onChange={(e) => setYieldForm({ ...yieldForm, actualRevenue: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Actual Harvest Date
                  </label>
                  <input
                    type="date"
                    required
                    className="input-control"
                    value={yieldForm.actualHarvestDate}
                    onChange={(e) => setYieldForm({ ...yieldForm, actualHarvestDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowYieldModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Yield & Mark Harvested</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
