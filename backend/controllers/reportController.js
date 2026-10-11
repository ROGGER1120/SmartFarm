import WaterLog from '../models/WaterLog.js';
import FertilizerLog from '../models/FertilizerLog.js';
import LabourAttendance from '../models/LabourAttendance.js';
import MachineryLog from '../models/MachineryLog.js';
import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';

export const getFarmExpenseReport = async (req, res) => {
  try {
    const { farmId, startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }
    const filter = farmId ? { farmId, ...dateFilter } : { ...dateFilter };

    const [water, fertilizers, labour, machinery] = await Promise.all([
      WaterLog.find(filter),
      FertilizerLog.find(filter),
      LabourAttendance.find(filter),
      MachineryLog.find(filter)
    ]);

    const records = [];

    water.forEach(w => {
      records.push({
        date: w.date,
        category: 'Water',
        item: `Irrigation via ${w.source} (${w.quantityLiters} L)`,
        crop: w.cropName,
        field: w.fieldName,
        amount: w.cost,
        remarks: w.abnormalFlag ? 'ABNORMAL CONSUMPTION' : 'Normal'
      });
    });

    fertilizers.forEach(f => {
      records.push({
        date: f.date,
        category: 'Fertilizer',
        item: `${f.fertilizerName} (${f.quantityUsed} ${f.unit})`,
        crop: f.cropName,
        field: f.fieldName,
        amount: f.totalCost,
        remarks: f.applicationMethod
      });
    });

    labour.forEach(l => {
      records.push({
        date: l.date,
        category: 'Labour',
        item: `${l.labourName} - ${l.role} (${l.hoursWorked} hrs)`,
        crop: l.cropName,
        field: l.fieldName,
        amount: l.wagePaid,
        remarks: l.taskDescription
      });
    });

    machinery.forEach(m => {
      records.push({
        date: m.date,
        category: 'Machinery',
        item: `${m.machineryName} - ${m.activityType} (${m.hoursRun} hrs)`,
        crop: m.cropName,
        field: m.fieldName,
        amount: m.totalExpense,
        remarks: `Fuel: ₹${m.fuelExpense}, Maint: ₹${m.maintenanceExpense}`
      });
    });

    // Sort by date descending
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalExpense = records.reduce((s, r) => s + (r.amount || 0), 0);

    res.json({
      records,
      totalExpense,
      totalCount: records.length,
      categoryBreakdown: {
        Water: water.reduce((s, i) => s + (i.cost || 0), 0),
        Fertilizer: fertilizers.reduce((s, i) => s + (i.totalCost || 0), 0),
        Labour: labour.reduce((s, i) => s + (i.wagePaid || 0), 0),
        Machinery: machinery.reduce((s, i) => s + (i.totalExpense || 0), 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCropProductionReport = async (req, res) => {
  try {
    const { farmId } = req.query;
    const filter = farmId ? { farmId } : {};
    const crops = await Crop.find(filter).sort({ sowingDate: -1 });

    const report = crops.map(c => ({
      name: c.name,
      variety: c.variety,
      season: c.season,
      fieldName: c.fieldName,
      areaCultivated: c.areaCultivated,
      sowingDate: c.sowingDate,
      expectedHarvestDate: c.expectedHarvestDate,
      actualHarvestDate: c.actualHarvestDate,
      stage: c.stage,
      estimatedYield: c.estimatedYield,
      actualYield: c.actualYield,
      yieldUnit: c.yieldUnit,
      actualRevenue: c.actualRevenue,
      status: c.status
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
