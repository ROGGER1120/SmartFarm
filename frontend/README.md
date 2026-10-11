# SmartFarm - Frontend Web Application

> Built with React 19, Vite, Recharts, Lucide Icons, and jsPDF. Designed with a Deep Forest Green theme inspired by modern agricultural SaaS dashboards.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will launch on **http://localhost:5174/** with automatic proxying to the backend API on port `5001`.

### 3. Build for Production
```bash
npm run build
```

---

## 🌟 Key Views Included

- **Soil & Nutrients Management (`SoilNutrientsView.jsx`)**: Pixel-accurate implementation of the reference design showing Sunflower plot, satellite field boundary, Soil pH, EC, Organic Carbon, Nitrogen (N), Phosphorous (P), Potassium (K), and Nutrient Recommendations.
- **Cultivation Budget Management (`BudgetView.jsx`)**: Comprehensive **Budget vs Actual** expenditure tracking with automatic **Pulsing Red Over-Budget Alerts** when actual expenses exceed planned budget.
- **Home Dashboard (`DashboardView.jsx`)**: Key farm operational statistics, active alerts, and recent activities.
- **Farm & Field Management (`FarmManagementView.jsx`)**: Multi-farm switcher, land acreage records, and field plot zoning.
- **Crop Lifecycle Tracker (`CropManagementView.jsx`)**: Phenological growth stages timeline from Sowing to Maturity, harvest countdown, and post-harvest yield revenue recording.
- **Water Management (`WaterManagementView.jsx`)**: Water meter logging, irrigation timers, and automatic **high consumption / leak anomaly detection**.
- **Fertilizer & Stock (`FertilizerView.jsx`)**: Fertilizer inventory, reorder threshold alerts, and field application logging.
- **Labour Workforce (`LabourManagementView.jsx`)**: Worker roster, daily wage rates, and attendance logger.
- **Machinery Fleet (`MachineryManagementView.jsx`)**: Equipment hours meter, diesel expense logs, and **150-hour maintenance due alerts**.
- **Analytics (`AnalyticsView.jsx`)**: Interactive Recharts for monthly expenses, water trends, fertilizer distribution, labour wages, and crop profitability.
- **Reports & Compliance (`ReportsView.jsx`)**: Filterable expense and crop production reports with **1-click CSV Export** and **Branded PDF Export** (powered by `jsPDF` + `jspdf-autotable`).
- **Weather Advisory (`WeatherView.jsx`)**: Hyperlocal weather forecasting, evapotranspiration, and spraying timing advisory.
