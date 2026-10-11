# SmartFarm - Farm Resource Management & Optimization System

> **A Full-Stack MERN Platform for Precision Agriculture, Agro-Resource Monitoring, Telemetry Anomaly Detection, and Cultivation Budget Optimization.**

![SmartFarm Dashboard](https://img.shields.io/badge/Stack-MERN-059669?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active_Development-10b981?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌾 Project Overview

**SmartFarm** is designed to empower farmers and agricultural managers to track, optimize, and control all key farming operations, resource inputs, and cultivation financials in one centralized, intuitive dashboard. 

The application implements a sleek **Deep Forest Green** aesthetic with real-time agronomic data visualization, satellite field plotting, automated anomaly detection, and **Budget vs Actual** financial analysis.

---

## 🚀 Key Features

### 1. 🏞️ Farm Management
- **Multiple Farm Management**: Create and switch between multiple farms and agricultural properties (e.g., *Farm 1 - Green Valley*, *Farm 2 - Cauvery Delta Fields*).
- **Land Acreage Records**: Record total land area in Acres, Hectares, or Cents.
- **Field Plot Zoning**: Manage individual field plots, soil classification (Red Loam, Clay Loam, Black Cotton, Alluvial), and cultivation boundaries.
- **Satellite Field Preview**: Interactive field plot boundaries with crop markers and plot pins.

### 2. 💧 Water Management & Anomaly Detection
- **Water Consumption Metering**: Log irrigation volume (Litres), duration (Hours), and source (Drip system, Borewell pump, Canal irrigation, Sprinklers).
- **Irrigation Schedules**: Configure automated timers and target volume by crop and valve zone.
- **Expense Tracking**: Track pumping electricity and canal release costs.
- **⚠️ Automated High Consumption / Leak Alert**: Automatically detects and highlights abnormal usage whenever actual consumption exceeds **120%** of planned allocation (e.g., night valve leaks).

### 3. 🧪 Soil & Nutrients Management *(UI Matched to Reference)*
- **Soil Chemical Benchmarks**:
  - **Soil pH**: 6.5 *(Benchmark: 0 to 14)*
  - **Soil EC Level**: 0.5 ds/m *(Benchmark: < 1 ds/m)*
  - **Organic Carbon**: 0.8% *(Benchmark: 0.5 to 0.75%)*
  - **Nitrogen (N)**: 240 kg/ha *(Benchmark: 280 to 560 kg/ha - Deficit alert)*
  - **Phosphorous (P)**: 12 kg/ha *(Benchmark: 22.5 to 56 kg/ha - Deficit alert)*
  - **Potassium (K)**: 200 kg/ha *(Benchmark: 120 to 280 kg/ha - Optimal)*
- **AI / Agronomist Summary Generator**: Generates instant clinical interpretations and application steps.
- **Precision Recommendations**: Targeted fertilizer dosage guidance (e.g., Neem-Coated Urea in split doses, Single Super Phosphate before flowering).

### 4. 📦 Fertilizer Inventory & Stock Alerts
- **Warehouse Inventory**: Track stock across Chemical (NPK, Urea, DAP), Organic Compost, and Bio-fertilizers.
- **⚠️ Low Stock Reorder Alerts**: Visual warnings when stock drops to or below the safety threshold.
- **Field Application Logs**: Record dosage, crop, plot, and method (Basal dressing, Fertigation, Foliar spray) with automatic stock deduction and expense calculation.

### 5. 👥 Labour Workforce & Wage Tracking
- **Worker Registry**: Manage farm workers, specialization roles (Sprayers, Tractor operators, Weeders, Harvesters), and daily wage rates.
- **Daily Attendance Logger**: Track attendance status (**Present**, **Half-Day**, **Overtime**, **Absent**).
- **Wage Ledger**: Automatically calculates daily wages and maintains historical labour expenses.

### 6. 🚜 Machinery Fleet & Maintenance Alerts
- **Equipment Fleet Registry**: Track Tractors (Mahindra 575 DI), Drone Sprayers (DJI Agras T40), Rotavators, Power Tillers, and Submersible Pumps.
- **Operating Telemetry**: Record operating hours and diesel fuel consumption.
- **⚠️ Maintenance Due Alerts**: Service countdown and alerts when equipment reaches the **150-hour service milestone** or due date.

### 7. 💰 Budget Management & Budget vs Actual Analysis *(Special Feature)*
- **Cultivation Budget Planner**: Set planned expense limits per season (*Kharif / Rabi*) for Water, Fertilizer, Labour, Machinery, Seeds, and Crop Protection.
- **Dynamic Cost Aggregation**: Automatically computes live actual expenses from water logs, fertilizer applications, labour wages, and machinery logs.
- **🚨 Over-Budget Visual Highlights**:
  - Automatically flags and highlights any category where actual spending exceeds planned budget with **pulsing red indicators**, **danger tags**, and **alert banners**.
  - **Illustrative Kharif 2026 Analysis Example**:

| Category | Planned (₹) | Actual (₹) | Variance (₹) | Status | Alert Highlight |
|---|---|---|---|---|---|
| **Water** | ₹2,000 | ₹2,500 | +₹500 (+25.0%) | **Budget Exceeded!** | 🔴 Highlighted in Red |
| **Fertilizer** | ₹5,000 | ₹4,500 | -₹500 (-10.0%) | Near Limit (90%) | 🟢 Under Budget |
| **Labour** | ₹8,000 | ₹7,500 | -₹500 (-6.3%) | Near Limit (93.8%) | 🟢 Under Budget |
| **Machinery** | ₹3,000 | ₹3,500 | +₹500 (+16.7%) | **Budget Exceeded!** | 🔴 Highlighted in Red |
| **Total** | **₹18,000** | **₹18,000** | **₹0 (100% matched)** | **Balanced** | 🟡 2 Categories Overrun |

- **Dual Bar Comparison Charts**: Visual side-by-side comparison of planned vs actual expenditure.

### 8. 🌱 Crop Phenological Stages & Yield Recording
- **Crop Lifecycle Stepper**: Track growth stages:
  $$\text{Land Preparation} \to \text{Sowing} \to \text{Vegetative} \to \text{Flowering} \to \text{Grain Filling} \to \text{Maturity} \to \text{Harvest}$$
- **Expected Harvest Countdown**: Track anticipated harvest dates.
- **Post-Harvest Yield Recording**: Log actual harvest quantities (Quintals, Bags, Tons) and realized crop revenue.

### 9. 📊 Analytics Dashboard
- Interactive charts powered by Recharts:
  - **Monthly Cultivation Expenses Trend** (Stacked breakdown).
  - **Water Usage Planned vs Actual Trends** (Line chart).
  - **Fertilizer Cost Distribution** (Donut / Pie chart).
  - **Labour Wages by Role** (Horizontal bar chart).
  - **Crop-Wise Economics** (Cumulative Cost vs Harvest Revenue).

### 10. 📑 Reports & One-Click Exports
- Filterable **Farm Expense Audit Report** with custom date ranges.
- Filterable **Crop Production & Yield Report**.
- **📥 One-Click Export to CSV**: Instant parsed CSV downloads.
- **📥 One-Click Export to PDF**: Generates branded, styled audit PDFs with data tables using `jsPDF` and `jspdf-autotable`.

### 11. ☀️ Agro-Weather Advisory
- Hyperlocal weather station telemetry: Temperature, Relative Humidity, Wind Speed, Solar Radiation, Evapotranspiration, and 5-day precipitation forecasts with daily spraying advisories.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Recharts, Lucide Icons, jsPDF, jspdf-autotable |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB (v6+ / v8+) with Mongoose ODM |
| **Styling** | Vanilla CSS Design System with CSS Tokens & Variables (Light/Dark mode) |

---

## ⚙️ Prerequisites

Before getting started, ensure you have the following installed on your machine:
1. **Node.js**: `v18.0.0` or higher (verified on Node `v24.4.1`)
2. **npm**: `v9.0.0` or higher (verified on npm `v11.4.2`)
3. **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

---

## 📦 Installation & Setup Instructions

### 1. Clone or Open the Repository
```bash
git clone <repository-url>
cd SmartFarm
```

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   A `.env` file is located in `backend/.env`. You can customize the settings if needed:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/smartfarm
   NODE_ENV=development
   ```

4. Populate Initial Realistic Demo Data:
   ```bash
   npm run seed
   ```
   *(This populates realistic farms, crops, water logs, low fertilizer stock, labour rosters, machinery, soil test parameters, and the exact Kharif 2026 Budget vs Actual test scenario.)*

5. Start the Backend Server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *The backend will start on **http://localhost:5001**.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite Development Server:
   ```bash
   npm run dev
   ```
   *The frontend will launch on **http://localhost:5174**.*

---

## 🌐 Application URLs & Endpoints

| Service | URL | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5174/` | SmartFarm Dashboard UI |
| **Backend API Server** | `http://localhost:5001/` | Express REST API |
| **API Health Check** | `http://localhost:5001/api/health` | Service status monitor |
| **Database** | `mongodb://127.0.0.1:27017/smartfarm` | MongoDB Database |

---

## 🔌 API Endpoints Reference

### Farms
- `GET /api/farms` - List all farms
- `GET /api/farms/:id` - Get specific farm details
- `POST /api/farms` - Create a new farm
- `POST /api/farms/:id/fields` - Add a field plot to a farm

### Crops
- `GET /api/crops?farmId=:id` - List crops for a farm
- `POST /api/crops` - Register a new crop
- `PATCH /api/crops/:id/stage` - Update crop growth stage & progress
- `PATCH /api/crops/:id/yield` - Record harvest yield and actual revenue

### Water & Irrigation
- `GET /api/water/logs?farmId=:id` - Get water usage logs
- `POST /api/water/logs` - Log water consumption (triggers anomaly check)
- `GET /api/water/schedules?farmId=:id` - Get active irrigation schedules
- `POST /api/water/schedules` - Add an irrigation schedule
- `GET /api/water/metrics?farmId=:id` - Get usage vs planned totals & leak alerts

### Fertilizer
- `GET /api/fertilizers?farmId=:id` - List fertilizer inventory
- `POST /api/fertilizers` - Add fertilizer purchase / stock
- `POST /api/fertilizers/apply` - Log field application (auto-deducts stock)
- `GET /api/fertilizers/stats?farmId=:id` - Get stock alerts and usage totals

### Labour
- `GET /api/labour?farmId=:id` - List farm workers
- `POST /api/labour` - Add a worker
- `GET /api/labour/attendance?farmId=:id` - Get attendance records
- `POST /api/labour/attendance` - Record daily attendance & calculate wage
- `GET /api/labour/stats?farmId=:id` - Get workforce and wage statistics

### Machinery
- `GET /api/machinery?farmId=:id` - List equipment fleet
- `POST /api/machinery` - Register equipment
- `POST /api/machinery/logs` - Log operating hours, fuel, and repairs
- `GET /api/machinery/stats?farmId=:id` - Get maintenance alerts and operating hours

### Budget
- `GET /api/budget/analysis?farmId=:id` - Live Budget vs Actual comparison & overrun detection
- `POST /api/budget` - Create or update cultivation budget allocations

### Soil & Nutrients
- `GET /api/soil?farmId=:id` - Get latest soil test parameters
- `PUT /api/soil/:id` - Update soil test values
- `POST /api/soil/generate-summary` - Generate AI agronomic analysis summary

### Analytics & Reports
- `GET /api/analytics/summary?farmId=:id` - Summary statistics
- `GET /api/analytics/charts?farmId=:id` - Time-series and distribution charts
- `GET /api/reports/expenses?farmId=:id` - Filterable expense audit report
- `GET /api/reports/crops?farmId=:id` - Crop production report
- `POST /api/seed` - Reset and re-seed database with demo data

---

## 🗂️ Project Structure

```
SmartFarm/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── analyticsController.js # Analytics & charting logic
│   │   ├── budgetController.js    # Budget vs Actual calculation & over-budget alerts
│   │   ├── cropController.js      # Crop phenology & yield recording
│   │   ├── farmController.js      # Farm & field plot operations
│   │   ├── fertilizerController.js# Fertilizer inventory & application logs
│   │   ├── labourController.js    # Labour roster & attendance wages
│   │   ├── machineryController.js # Equipment fleet & maintenance countdowns
│   │   ├── reportController.js    # Expense & crop production report generation
│   │   ├── soilController.js      # Soil test parameters & AI summaries
│   │   └── waterController.js     # Water metering & leak anomaly flags
│   ├── models/                   # Mongoose schemas for all entities
│   ├── routes/                   # Express routes
│   ├── seed/
│   │   ├── seed.js               # CLI runner (`npm run seed`)
│   │   └── seedData.js           # Realistic agricultural seed dataset
│   ├── .env                      # Backend configuration
│   ├── .gitignore                # Backend ignore file
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js          # Unified API client
│   │   ├── components/
│   │   │   ├── AddFarmModal.jsx  # New farm & plot modal
│   │   │   ├── NotificationDrawer.jsx # Slide-out active alert drawer
│   │   │   ├── Sidebar.jsx       # Deep Forest Green navigation sidebar
│   │   │   └── TopNavbar.jsx     # Farm selector, search & quick actions
│   │   ├── views/
│   │   │   ├── AnalyticsView.jsx # Visual Recharts analytics
│   │   │   ├── BudgetView.jsx    # Budget vs Actual comparison & overrun alerts
│   │   │   ├── CropManagementView.jsx # Growth stages & harvest yield logger
│   │   │   ├── DashboardView.jsx # Main farm overview dashboard
│   │   │   ├── FarmManagementView.jsx # Farms & field boundaries
│   │   │   ├── FertilizerView.jsx # Stock inventory & low-stock alerts
│   │   │   ├── LabourManagementView.jsx # Workers & daily attendance
│   │   │   ├── MachineryManagementView.jsx # Fleet & maintenance alerts
│   │   │   ├── ReportsView.jsx   # Filterable reports with CSV & PDF export
│   │   │   ├── SoilNutrientsView.jsx # Pixel-accurate soil analysis view
│   │   │   └── WeatherView.jsx   # Agro-meteorological advisory
│   │   ├── App.jsx               # Master application container
│   │   ├── index.css             # Krishivedika design system tokens
│   │   └── main.jsx
│   ├── .gitignore                # Frontend ignore file
│   ├── index.html
│   ├── package.json
│   └── vite.config.js            # Port 5174 & API proxy setup
│
├── .gitignore                    # Root repository ignore file
└── README.md                     # Comprehensive project documentation
```

---

## 👨‍🌾 User Workflow Example

```
Farmer Login
     ↓
Select / Create Farm (e.g. Farm 1 - Green Valley)
     ↓
Inspect Soil Test Analysis & NPK Benchmarks
     ↓
Enter Water / Fertilizer / Labour / Machinery Logs
     ↓
System Evaluates Consumption Against Thresholds:
     ├── Flags Leak if Water > 120% Planned
     ├── Flags Low Stock if Fertilizer <= Threshold
     └── Flags Service Due if Tractor >= 150 hrs
     ↓
Compare Budget vs Actual Analysis:
     └── Exceeded Categories (Water +25%, Machinery +16.7%) Highlighted in RED!
     ↓
Export Official PDF or CSV Audit Report
```

---

## 📄 License
This project is licensed under the MIT License.
