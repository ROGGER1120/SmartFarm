const API_BASE = '/api';

export const api = {
  // Farms
  getFarms: () => fetch(`${API_BASE}/farms`).then(r => r.json()),
  getFarm: (id) => fetch(`${API_BASE}/farms/${id}`).then(r => r.json()),
  createFarm: (data) => fetch(`${API_BASE}/farms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  addField: (farmId, field) => fetch(`${API_BASE}/farms/${farmId}/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(field)
  }).then(r => r.json()),

  // Crops
  getCrops: (farmId) => fetch(`${API_BASE}/crops?farmId=${farmId}`).then(r => r.json()),
  createCrop: (data) => fetch(`${API_BASE}/crops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateCropStage: (id, stageData) => fetch(`${API_BASE}/crops/${id}/stage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stageData)
  }).then(r => r.json()),
  recordCropYield: (id, yieldData) => fetch(`${API_BASE}/crops/${id}/yield`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(yieldData)
  }).then(r => r.json()),

  // Water
  getWaterLogs: (farmId) => fetch(`${API_BASE}/water/logs?farmId=${farmId}`).then(r => r.json()),
  addWaterLog: (data) => fetch(`${API_BASE}/water/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getIrrigationSchedules: (farmId) => fetch(`${API_BASE}/water/schedules?farmId=${farmId}`).then(r => r.json()),
  addIrrigationSchedule: (data) => fetch(`${API_BASE}/water/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getWaterMetrics: (farmId) => fetch(`${API_BASE}/water/metrics?farmId=${farmId}`).then(r => r.json()),

  // Fertilizer
  getFertilizers: (farmId) => fetch(`${API_BASE}/fertilizers?farmId=${farmId}`).then(r => r.json()),
  addFertilizer: (data) => fetch(`${API_BASE}/fertilizers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getFertilizerLogs: (farmId) => fetch(`${API_BASE}/fertilizers/logs?farmId=${farmId}`).then(r => r.json()),
  logFertilizerApplication: (data) => fetch(`${API_BASE}/fertilizers/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getFertilizerStats: (farmId) => fetch(`${API_BASE}/fertilizers/stats?farmId=${farmId}`).then(r => r.json()),

  // Labour
  getLabourList: (farmId) => fetch(`${API_BASE}/labour?farmId=${farmId}`).then(r => r.json()),
  addLabour: (data) => fetch(`${API_BASE}/labour`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getAttendance: (farmId) => fetch(`${API_BASE}/labour/attendance?farmId=${farmId}`).then(r => r.json()),
  recordAttendance: (data) => fetch(`${API_BASE}/labour/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getLabourStats: (farmId) => fetch(`${API_BASE}/labour/stats?farmId=${farmId}`).then(r => r.json()),

  // Machinery
  getMachineryList: (farmId) => fetch(`${API_BASE}/machinery?farmId=${farmId}`).then(r => r.json()),
  addMachinery: (data) => fetch(`${API_BASE}/machinery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getMachineryLogs: (farmId) => fetch(`${API_BASE}/machinery/logs?farmId=${farmId}`).then(r => r.json()),
  logMachineryUsage: (data) => fetch(`${API_BASE}/machinery/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getMachineryStats: (farmId) => fetch(`${API_BASE}/machinery/stats?farmId=${farmId}`).then(r => r.json()),

  // Budget
  getBudgetAnalysis: (farmId) => fetch(`${API_BASE}/budget/analysis?farmId=${farmId}`).then(r => r.json()),
  updateBudget: (data) => fetch(`${API_BASE}/budget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Soil
  getSoilReport: (farmId) => fetch(`${API_BASE}/soil?farmId=${farmId}`).then(r => r.json()),
  updateSoilReport: (id, data) => fetch(`${API_BASE}/soil/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  generateSoilSummary: (farmId) => fetch(`${API_BASE}/soil/generate-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ farmId })
  }).then(r => r.json()),

  // Analytics & Summary
  getDashboardSummary: (farmId) => fetch(`${API_BASE}/analytics/summary?farmId=${farmId}`).then(r => r.json()),
  getChartsData: (farmId) => fetch(`${API_BASE}/analytics/charts?farmId=${farmId}`).then(r => r.json()),

  // Reports
  getExpenseReport: (farmId, startDate, endDate) => {
    let url = `${API_BASE}/reports/expenses?farmId=${farmId}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return fetch(url).then(r => r.json());
  },
  getCropReport: (farmId) => fetch(`${API_BASE}/reports/crops?farmId=${farmId}`).then(r => r.json()),

  // Reseed DB
  reseedDatabase: () => fetch(`${API_BASE}/seed`, { method: 'POST' }).then(r => r.json())
};
