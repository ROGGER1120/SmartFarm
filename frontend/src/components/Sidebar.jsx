import React from 'react';
import { 
  Home, 
  CloudSun, 
  MapPin, 
  Sprout, 
  CalendarCheck, 
  DollarSign, 
  FlaskConical, 
  Droplet, 
  Package, 
  Users, 
  Tractor, 
  BarChart3, 
  FileText, 
  Settings, 
  HelpCircle, 
  Sun, 
  Moon,
  Leaf
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, darkMode, setDarkMode, alertCounts }) {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'soil', label: 'Soil & Nutrients', icon: FlaskConical, badge: null },
    { id: 'budget', label: 'Accounting / Budget', icon: DollarSign, badge: alertCounts?.budgetExceeded ? 'Exceeded' : null, badgeColor: 'red' },
    { id: 'farms', label: 'Farm Management', icon: MapPin },
    { id: 'crops', label: 'Crop Management', icon: Sprout },
    { id: 'water', label: 'Water Management', icon: Droplet, badge: alertCounts?.abnormalWater ? 'Alert' : null, badgeColor: 'amber' },
    { id: 'fertilizer', label: 'Fertilizer & Stock', icon: Package, badge: alertCounts?.lowStock ? 'Low' : null, badgeColor: 'amber' },
    { id: 'labour', label: 'Labour Management', icon: Users },
    { id: 'machinery', label: 'Machinery Fleet', icon: Tractor, badge: alertCounts?.serviceDue ? 'Service' : null, badgeColor: 'red' },
    { id: 'tasks', label: 'Tasks & Irrigation', icon: CalendarCheck },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
  ];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRight: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Brand Logo Header */}
      <div style={{
        padding: '22px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.35)'
        }}>
          <Leaf size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              SmartFarm
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 500, letterSpacing: '0.04em' }}>
            SmartFarm ERP • SaaS
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        flex: 1,
        padding: '14px 12px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#34d399' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  backgroundColor: item.badgeColor === 'red' ? '#ef4444' : '#f59e0b',
                  color: '#ffffff',
                  boxShadow: item.badgeColor === 'red' ? '0 0 8px rgba(239, 68, 68, 0.4)' : 'none'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Utilities */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem'
            }}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem'
            }}
          >
            <HelpCircle size={16} />
            <span>Help</span>
          </button>
        </div>

        {/* Theme Toggle & Farmer Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '6px'
        }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light/Dark Theme"
            style={{
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem'
            }}
          >
            {darkMode ? <Sun size={14} color="#facc15" /> : <Moon size={14} color="#38bdf8" />}
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#ffffff'
            }}>
              FA
            </div>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Farmer Arini</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
