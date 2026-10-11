import React from 'react';
import { Search, Bell, Plus, RefreshCw, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TopNavbar({ 
  farms, 
  selectedFarmId, 
  onSelectFarm, 
  onOpenAddFarm, 
  searchQuery, 
  setSearchQuery,
  alertCount,
  onOpenNotifications,
  onReseed,
  isReseeding
}) {
  const currentFarm = farms?.find(f => f._id === selectedFarmId) || farms?.[0];

  return (
    <header style={{
      height: '68px',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Left: Farm Selector Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedFarmId || ''}
            onChange={(e) => onSelectFarm(e.target.value)}
            style={{
              padding: '8px 34px 8px 14px',
              backgroundColor: 'var(--bg-body)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              minWidth: '220px'
            }}
          >
            {farms?.map(farm => (
              <option key={farm._id} value={farm._id}>
                {farm.name} ({farm.totalArea} {farm.areaUnit})
              </option>
            ))}
          </select>
          <ChevronDown 
            size={16} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
          />
        </div>

        {currentFarm && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'none', md: 'inline' }}>
            📍 {currentFarm.location}
          </span>
        )}
      </div>

      {/* Middle: Global Search Input */}
      <div style={{
        flex: 1,
        maxWidth: '420px',
        margin: '0 20px',
        position: 'relative'
      }}>
        <Search 
          size={16} 
          color="var(--text-muted)" 
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
        />
        <input
          type="text"
          placeholder="Ex: Crop growth, fertilizer, tractor, water..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 14px 8px 38px',
            backgroundColor: 'var(--bg-body)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '0.84rem',
            color: 'var(--text-main)',
            outline: 'none'
          }}
        />
      </div>

      {/* Right: Actions, Notifications & Add Farm Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Reset / Reseed Demo Data */}
        <button
          onClick={onReseed}
          disabled={isReseeding}
          title="Reset & Seed Realistic Demo Farm Data"
          className="btn btn-secondary"
          style={{ padding: '7px 12px', fontSize: '0.8rem' }}
        >
          <RefreshCw size={14} className={isReseeding ? 'animate-spin' : ''} />
          <span>{isReseeding ? 'Resetting...' : 'Reset Demo'}</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-body)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="View Active Farm Alerts"
        >
          <Bell size={18} color="var(--text-secondary)" />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
            }}>
              {alertCount}
            </span>
          )}
        </button>

        {/* + Add New Farm Button */}
        <button
          onClick={onOpenAddFarm}
          className="btn btn-primary"
          style={{ padding: '8px 18px', borderRadius: '8px' }}
        >
          <Plus size={16} />
          <span>Add new farm</span>
        </button>
      </div>
    </header>
  );
}
