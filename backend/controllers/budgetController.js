import Budget from '../models/Budget.js';
import WaterLog from '../models/WaterLog.js';
import FertilizerLog from '../models/FertilizerLog.js';
import LabourAttendance from '../models/LabourAttendance.js';
import MachineryLog from '../models/MachineryLog.js';

export const getBudgets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    const budgets = await Budget.find(filter).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveBudget = async (req, res) => {
  try {
    const { farmId } = req.query;
    if (!farmId) return res.status(400).json({ message: 'farmId is required' });

    let budget = await Budget.findOne({ farmId, status: 'Active' });
    if (!budget) {
      budget = await Budget.findOne({ farmId }).sort({ createdAt: -1 });
    }

    if (!budget) {
      // Create initial default budget matching example
      budget = new Budget({
        farmId,
        season: 'Kharif 2026',
        year: 2026,
        categories: [
          { category: 'Water', planned: 2000, actual: 2500, notes: 'Borewell pump electricity & irrigation canal dues' },
          { category: 'Fertilizer', planned: 5000, actual: 4500, notes: 'Urea, DAP, NPK 19-19-19 & Micronutrients' },
          { category: 'Labour', planned: 8000, actual: 7500, notes: 'Weeding, spraying, bed preparation & harvesting' },
          { category: 'Machinery', planned: 3000, actual: 3500, notes: 'Tractor diesel & rotavator operator charges' }
        ]
      });
      await budget.save();
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrUpdateBudget = async (req, res) => {
  try {
    const { farmId, season, year, categories, notes } = req.body;

    let budget = await Budget.findOne({ farmId, season });
    if (budget) {
      budget.categories = categories;
      if (year) budget.year = year;
      if (notes) budget.notes = notes;
    } else {
      budget = new Budget({ farmId, season, year: year || 2026, categories, notes });
    }

    const saved = await budget.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBudgetVsActualAnalysis = async (req, res) => {
  try {
    const { farmId } = req.query;
    if (!farmId) return res.status(400).json({ message: 'farmId is required' });

    let budget = await Budget.findOne({ farmId, status: 'Active' });
    if (!budget) {
      budget = await Budget.findOne({ farmId }).sort({ createdAt: -1 });
    }

    if (!budget) {
      return res.status(404).json({ message: 'No budget defined for this farm' });
    }

    // Calculate dynamic actuals from individual modules
    const [waterLogs, fertilizerLogs, labourLogs, machineryLogs] = await Promise.all([
      WaterLog.find({ farmId }),
      FertilizerLog.find({ farmId }),
      LabourAttendance.find({ farmId }),
      MachineryLog.find({ farmId })
    ]);

    const moduleActuals = {
      Water: waterLogs.reduce((s, i) => s + (i.cost || 0), 0),
      Fertilizer: fertilizerLogs.reduce((s, i) => s + (i.totalCost || 0), 0),
      Labour: labourLogs.reduce((s, i) => s + (i.wagePaid || 0), 0),
      Machinery: machineryLogs.reduce((s, i) => s + (i.totalExpense || 0), 0)
    };

    // Analyze each category
    const analysis = budget.categories.map(cat => {
      // If module has recorded actuals, prefer module actuals or fallback to budget saved actual
      const actualVal = moduleActuals[cat.category] > 0 ? moduleActuals[cat.category] : cat.actual;
      const plannedVal = cat.planned;
      const variance = actualVal - plannedVal;
      const isExceeded = actualVal > plannedVal;
      const percentageUsed = plannedVal > 0 ? ((actualVal / plannedVal) * 100).toFixed(1) : 0;
      const variancePercentage = plannedVal > 0 ? (((actualVal - plannedVal) / plannedVal) * 100).toFixed(1) : 0;

      let status = 'Under Budget';
      let statusColor = 'green';
      if (isExceeded) {
        status = 'Budget Exceeded!';
        statusColor = 'red';
      } else if (Number(percentageUsed) >= 90) {
        status = 'Near Limit';
        statusColor = 'amber';
      }

      return {
        category: cat.category,
        planned: plannedVal,
        actual: actualVal,
        variance,
        isExceeded,
        percentageUsed: Number(percentageUsed),
        variancePercentage: Number(variancePercentage),
        remaining: plannedVal - actualVal,
        status,
        statusColor,
        notes: cat.notes
      };
    });

    const totalPlanned = analysis.reduce((sum, item) => sum + item.planned, 0);
    const totalActual = analysis.reduce((sum, item) => sum + item.actual, 0);
    const totalVariance = totalActual - totalPlanned;
    const isOverallExceeded = totalActual > totalPlanned;
    const remainingBudget = totalPlanned - totalActual;
    const exceededCategories = analysis.filter(item => item.isExceeded);

    res.json({
      budgetId: budget._id,
      season: budget.season,
      year: budget.year,
      totalPlanned,
      totalActual,
      totalVariance,
      isOverallExceeded,
      remainingBudget,
      exceededCount: exceededCategories.length,
      exceededCategories,
      categories: analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
