import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import WaterLog from '../models/WaterLog.js';
import FertilizerLog from '../models/FertilizerLog.js';
import LabourAttendance from '../models/LabourAttendance.js';
import MachineryLog from '../models/MachineryLog.js';
import Budget from '../models/Budget.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const { farmId } = req.query;
    const filter = farmId ? { farmId } : {};

    const [farms, crops, waterLogs, fertilizerLogs, labourLogs, machineryLogs] = await Promise.all([
      Farm.find(),
      Crop.find(filter),
      WaterLog.find(filter),
      FertilizerLog.find(filter),
      LabourAttendance.find(filter),
      MachineryLog.find(filter)
    ]);

    const activeCrops = crops.filter(c => c.status === 'Active');
    const waterExpense = waterLogs.reduce((s, i) => s + (i.cost || 0), 0);
    const fertilizerExpense = fertilizerLogs.reduce((s, i) => s + (i.totalCost || 0), 0);
    const labourExpense = labourLogs.reduce((s, i) => s + (i.wagePaid || 0), 0);
    const machineryExpense = machineryLogs.reduce((s, i) => s + (i.totalExpense || 0), 0);
    const totalExpenses = waterExpense + fertilizerExpense + labourExpense + machineryExpense;

    // Abnormal water flags
    const abnormalWaterCount = waterLogs.filter(w => w.abnormalFlag).length;

    // Budget check
    let activeBudget = null;
    if (farmId) {
      activeBudget = await Budget.findOne({ farmId, status: 'Active' });
    } else {
      activeBudget = await Budget.findOne({ status: 'Active' });
    }

    let budgetExceeded = false;
    let plannedBudget = activeBudget ? activeBudget.totalPlanned : 18000;
    if (activeBudget && totalExpenses > plannedBudget) {
      budgetExceeded = true;
    }

    res.json({
      totalFarms: farms.length,
      activeCropsCount: activeCrops.length,
      totalExpenses,
      categoryExpenses: {
        Water: waterExpense,
        Fertilizer: fertilizerExpense,
        Labour: labourExpense,
        Machinery: machineryExpense
      },
      plannedBudget,
      remainingBudget: Math.max(0, plannedBudget - totalExpenses),
      budgetExceeded,
      abnormalWaterCount,
      activeFarms: farms.map(f => ({ id: f._id, name: f.name, location: f.location, totalArea: f.totalArea }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChartsData = async (req, res) => {
  try {
    const { farmId } = req.query;
    const filter = farmId ? { farmId } : {};

    const [waterLogs, fertilizerLogs, labourLogs, machineryLogs, crops] = await Promise.all([
      WaterLog.find(filter).sort({ date: 1 }),
      FertilizerLog.find(filter).sort({ date: 1 }),
      LabourAttendance.find(filter).sort({ date: 1 }),
      MachineryLog.find(filter).sort({ date: 1 }),
      Crop.find(filter)
    ]);

    // Monthly expense breakdown
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySpending = months.map(m => ({
      month: m,
      Water: 0,
      Fertilizer: 0,
      Labour: 0,
      Machinery: 0,
      Total: 0
    }));

    waterLogs.forEach(w => {
      const mIdx = new Date(w.date).getMonth();
      monthlySpending[mIdx].Water += w.cost || 0;
      monthlySpending[mIdx].Total += w.cost || 0;
    });

    fertilizerLogs.forEach(f => {
      const mIdx = new Date(f.date).getMonth();
      monthlySpending[mIdx].Fertilizer += f.totalCost || 0;
      monthlySpending[mIdx].Total += f.totalCost || 0;
    });

    labourLogs.forEach(l => {
      const mIdx = new Date(l.date).getMonth();
      monthlySpending[mIdx].Labour += l.wagePaid || 0;
      monthlySpending[mIdx].Total += l.wagePaid || 0;
    });

    machineryLogs.forEach(m => {
      const mIdx = new Date(m.date).getMonth();
      monthlySpending[mIdx].Machinery += m.totalExpense || 0;
      monthlySpending[mIdx].Total += m.totalExpense || 0;
    });

    // Water consumption comparison (Actual vs Planned over time)
    const waterTrends = waterLogs.map(w => ({
      date: new Date(w.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      actualLiters: w.quantityLiters,
      plannedLiters: w.plannedLiters,
      cost: w.cost,
      abnormal: w.abnormalFlag
    }));

    // Fertilizer by type
    const fertilizerBreakdown = {};
    fertilizerLogs.forEach(f => {
      fertilizerBreakdown[f.fertilizerName] = (fertilizerBreakdown[f.fertilizerName] || 0) + f.totalCost;
    });
    const fertilizerChart = Object.keys(fertilizerBreakdown).map(k => ({
      name: k,
      cost: fertilizerBreakdown[k]
    }));

    // Labour wages by role
    const labourRoleMap = {};
    labourLogs.forEach(l => {
      labourRoleMap[l.role] = (labourRoleMap[l.role] || 0) + l.wagePaid;
    });
    const labourRoleChart = Object.keys(labourRoleMap).map(k => ({
      role: k,
      amount: labourRoleMap[k]
    }));

    // Crop-wise comparison
    const cropExpenses = crops.map(c => {
      const cWater = waterLogs.filter(w => String(w.cropId) === String(c._id)).reduce((s, i) => s + (i.cost || 0), 0);
      const cFert = fertilizerLogs.filter(f => String(f.cropId) === String(c._id)).reduce((s, i) => s + (i.totalCost || 0), 0);
      const cLabour = labourLogs.filter(l => String(l.cropId) === String(c._id)).reduce((s, i) => s + (i.wagePaid || 0), 0);
      const cMach = machineryLogs.filter(m => String(m.cropId) === String(c._id)).reduce((s, i) => s + (i.totalExpense || 0), 0);
      const total = cWater + cFert + cLabour + cMach;

      return {
        name: c.name,
        variety: c.variety,
        totalCost: total,
        expectedRevenue: (c.estimatedYield || 0) * (c.marketPricePerUnit || 0),
        actualRevenue: c.actualRevenue || 0,
        area: c.areaCultivated
      };
    });

    res.json({
      monthlySpending,
      waterTrends,
      fertilizerChart,
      labourRoleChart,
      cropExpenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
