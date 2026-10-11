import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import AddFarmModal from './components/AddFarmModal';
import NotificationDrawer from './components/NotificationDrawer';

// Views
import DashboardView from './views/DashboardView';
import SoilNutrientsView from './views/SoilNutrientsView';
import BudgetView from './views/BudgetView';
import FarmManagementView from './views/FarmManagementView';
import CropManagementView from './views/CropManagementView';
import WaterManagementView from './views/WaterManagementView';
import FertilizerView from './views/FertilizerView';
import LabourManagementView from './views/LabourManagementView';
import MachineryManagementView from './views/MachineryManagementView';
import AnalyticsView from './views/AnalyticsView';
import ReportsView from './views/ReportsView';
import WeatherView from './views/WeatherView';

import { api } from './api';

export default function App() {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [activeTab, setActiveTab] = useState('soil'); // Default to Soil & Nutrients as in user screenshot!
  const [darkMode, setDarkMode] = useState(false);
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReseeding, setIsReseeding] = useState(false);

  // Live Alert States
  const [budgetData, setBudgetData] = useState(null);
  const [fertilizerStats, setFertilizerStats] = useState(null);
  const [waterMetrics, setWaterMetrics] = useState(null);
  const [machineryStats, setMachineryStats] = useState(null);

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (selectedFarmId) {
      loadAlerts();
    }
  }, [selectedFarmId]);

  // Handle Dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const loadFarms = async () => {
    try {
      const data = await api.getFarms();
      setFarms(data);
      if (data && data.length > 0) {
        // Select primary farm or first farm
        const primary = data.find(f => f.isPrimary) || data[0];
        setSelectedFarmId(primary._id);
      }
    } catch (err) {
      console.error('Failed to load farms', err);
    }
  };

  const loadAlerts = async () => {
    try {
      const [bgt, fert, wat, mach] = await Promise.all([
        api.getBudgetAnalysis(selectedFarmId),
        api.getFertilizerStats(selectedFarmId),
        api.getWaterMetrics(selectedFarmId),
        api.getMachineryStats(selectedFarmId)
      ]);
      setBudgetData(bgt);
      setFertilizerStats(fert);
      setWaterMetrics(wat);
      setMachineryStats(mach);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReseed = async () => {
    try {
      setIsReseeding(true);
      await api.reseedDatabase();
      await loadFarms();
      await loadAlerts();
    } catch (err) {
      console.error('Reseed error', err);
    } finally {
      setIsReseeding(false);
    }
  };

  // Compute total alert counts
  const alertCounts = {
    budgetExceeded: (budgetData?.exceededCategories?.length || 0) > 0,
    lowStock: (fertilizerStats?.lowStockItems?.length || 0) > 0,
    abnormalWater: (waterMetrics?.abnormalCount || 0) > 0,
    serviceDue: (machineryStats?.serviceAlerts?.length || 0) > 0
  };

  const totalAlertCount = 
    (budgetData?.exceededCategories?.length || 0) +
    (fertilizerStats?.lowStockItems?.length || 0) +
    (waterMetrics?.recentAbnormalLogs?.length || 0) +
    (machineryStats?.serviceAlerts?.length || 0);

  // Search filter routing
  const handleSearchNav = (query) => {
    setSearchQuery(query);
    const q = query.toLowerCase();
    if (q.includes('budget') || q.includes('cost') || q.includes('expense') || q.includes('actual')) {
      setActiveTab('budget');
    } else if (q.includes('soil') || q.includes('nutrient') || q.includes('npk') || q.includes('ph')) {
      setActiveTab('soil');
    } else if (q.includes('water') || q.includes('irrigation') || q.includes('drip') || q.includes('leak')) {
      setActiveTab('water');
    } else if (q.includes('fertilizer') || q.includes('urea') || q.includes('stock')) {
      setActiveTab('fertilizer');
    } else if (q.includes('crop') || q.includes('sunflower') || q.includes('paddy') || q.includes('yield')) {
      setActiveTab('crops');
    } else if (q.includes('tractor') || q.includes('machin') || q.includes('drone')) {
      setActiveTab('machinery');
    } else if (q.includes('labour') || q.includes('wage') || q.includes('attendance')) {
      setActiveTab('labour');
    } else if (q.includes('report') || q.includes('pdf') || q.includes('csv')) {
      setActiveTab('reports');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
      {/* 1. Left Sidebar (Krishivedika Deep Forest Green) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        alertCounts={alertCounts}
      />

      {/* 2. Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Navigation Bar */}
        <TopNavbar
          farms={farms}
          selectedFarmId={selectedFarmId}
          onSelectFarm={setSelectedFarmId}
          onOpenAddFarm={() => setIsAddFarmOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchNav}
          alertCount={totalAlertCount}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onReseed={handleReseed}
          isReseeding={isReseeding}
        />

        {/* View Router */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <DashboardView
              farmId={selectedFarmId}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'soil' && (
            <SoilNutrientsView
              farmId={selectedFarmId}
              onNavigateToBudget={() => setActiveTab('budget')}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'farms' && (
            <FarmManagementView
              farms={farms}
              selectedFarmId={selectedFarmId}
              onFarmCreated={loadFarms}
            />
          )}

          {activeTab === 'crops' && (
            <CropManagementView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'water' && (
            <WaterManagementView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'fertilizer' && (
            <FertilizerView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'labour' && (
            <LabourManagementView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'machinery' && (
            <MachineryManagementView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'tasks' && (
            <WaterManagementView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'weather' && (
            <WeatherView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              farmId={selectedFarmId}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              farmId={selectedFarmId}
            />
          )}

          {(activeTab === 'settings' || activeTab === 'help') && (
            <div className="animate-fade-in" style={{ padding: '32px' }}>
              <div className="card" style={{ padding: '32px', maxWidth: '640px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                  {activeTab === 'settings' ? 'SmartFarm ERP System Settings' : 'Farmer Help & Agronomic Documentation'}
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  SmartFarm is an NDA-compliant SaaS farm management & optimization system designed for comprehensive agro-resource budgeting, telemetry anomaly detection and yield tracking.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
                  <div><strong>API Backend Server:</strong> http://localhost:5001</div>
                  <div><strong>Database Engine:</strong> MongoDB (Port 27017, Database: smartfarm)</div>
                  <div><strong>Active Currency:</strong> Indian Rupee (₹)</div>
                  <div><strong>Localization:</strong> Tamil Nadu Agro-Climatic Zones (Coimbatore, Pollachi, Thanjavur)</div>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                  <button onClick={handleReseed} disabled={isReseeding} className="btn btn-primary">
                    <span>Reset & Seed Realistic Demo Farm Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Farm Modal */}
      <AddFarmModal
        isOpen={isAddFarmOpen}
        onClose={() => setIsAddFarmOpen(false)}
        onFarmCreated={loadFarms}
      />

      {/* Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={setActiveTab}
        budgetData={budgetData}
        fertilizerStats={fertilizerStats}
        waterMetrics={waterMetrics}
        machineryStats={machineryStats}
      />
    </div>
  );
}
