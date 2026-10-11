import WaterLog from '../models/WaterLog.js';
import IrrigationSchedule from '../models/IrrigationSchedule.js';

export const getWaterLogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    if (req.query.cropId) filter.cropId = req.query.cropId;
    if (req.query.abnormalOnly === 'true') filter.abnormalFlag = true;

    const logs = await WaterLog.find(filter).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addWaterLog = async (req, res) => {
  try {
    const log = new WaterLog(req.body);
    const saved = await log.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWaterLog = async (req, res) => {
  try {
    const deleted = await WaterLog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Water log not found' });
    res.json({ message: 'Water log deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIrrigationSchedules = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    const schedules = await IrrigationSchedule.find(filter).sort({ createdAt: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addIrrigationSchedule = async (req, res) => {
  try {
    const schedule = new IrrigationSchedule(req.body);
    const saved = await schedule.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateIrrigationSchedule = async (req, res) => {
  try {
    const updated = await IrrigationSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Schedule not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteIrrigationSchedule = async (req, res) => {
  try {
    const deleted = await IrrigationSchedule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWaterMetrics = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;

    const logs = await WaterLog.find(filter);
    const totalActualLiters = logs.reduce((sum, item) => sum + (item.quantityLiters || 0), 0);
    const totalPlannedLiters = logs.reduce((sum, item) => sum + (item.plannedLiters || 0), 0);
    const totalWaterCost = logs.reduce((sum, item) => sum + (item.cost || 0), 0);
    const abnormalCount = logs.filter(item => item.abnormalFlag).length;

    const varianceLiters = totalActualLiters - totalPlannedLiters;
    const variancePercentage = totalPlannedLiters > 0 ? ((varianceLiters / totalPlannedLiters) * 100).toFixed(1) : 0;

    res.json({
      totalActualLiters,
      totalPlannedLiters,
      totalWaterCost,
      abnormalCount,
      varianceLiters,
      variancePercentage: Number(variancePercentage),
      isExceeded: totalActualLiters > totalPlannedLiters,
      recentAbnormalLogs: logs.filter(item => item.abnormalFlag).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
