import Machinery from '../models/Machinery.js';
import MachineryLog from '../models/MachineryLog.js';

export const getMachineryList = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    const machines = await Machinery.find(filter).sort({ name: 1 });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMachinery = async (req, res) => {
  try {
    const machine = new Machinery(req.body);
    const saved = await machine.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMachinery = async (req, res) => {
  try {
    const updated = await Machinery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Machinery not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMachinery = async (req, res) => {
  try {
    const deleted = await Machinery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Machinery not found' });
    res.json({ message: 'Machinery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMachineryLogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    if (req.query.machineryId) filter.machineryId = req.query.machineryId;
    const logs = await MachineryLog.find(filter).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logMachineryUsage = async (req, res) => {
  try {
    const { farmId, machineryId, cropId, cropName, fieldName, date, hoursRun, fuelConsumedLiters, fuelExpense, maintenanceExpense, operatorName, activityType, notes } = req.body;

    const machine = await Machinery.findById(machineryId);
    if (!machine) return res.status(404).json({ message: 'Machinery equipment not found' });

    // Update machinery hours
    machine.totalOperatingHours = (machine.totalOperatingHours || 0) + Number(hoursRun);
    await machine.save();

    const totalExpense = (Number(fuelExpense) || 0) + (Number(maintenanceExpense) || 0);

    const log = new MachineryLog({
      farmId,
      machineryId,
      machineryName: machine.name,
      cropId,
      cropName: cropName || 'Sunflower',
      fieldName: fieldName || 'Field 1',
      date: date || new Date(),
      hoursRun: Number(hoursRun),
      fuelConsumedLiters: Number(fuelConsumedLiters) || 0,
      fuelExpense: Number(fuelExpense) || 0,
      maintenanceExpense: Number(maintenanceExpense) || 0,
      totalExpense,
      operatorName: operatorName || 'Driver',
      activityType: activityType || 'Ploughing / Deep Tilling',
      notes
    });

    const saved = await log.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMachineryAlertsAndStats = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;

    const machines = await Machinery.find(filter);
    const logs = await MachineryLog.find(filter);

    const now = new Date();
    const serviceAlerts = machines.filter(m => {
      if (m.maintenanceStatus === 'Service Due' || m.maintenanceStatus === 'Breakdown') return true;
      if (m.nextServiceDate && new Date(m.nextServiceDate) <= now) return true;
      return false;
    });

    const totalOperatingHours = machines.reduce((sum, m) => sum + (m.totalOperatingHours || 0), 0);
    const totalExpenses = logs.reduce((sum, l) => sum + (l.totalExpense || 0), 0);

    res.json({
      totalFleetCount: machines.length,
      serviceAlertCount: serviceAlerts.length,
      serviceAlerts,
      totalOperatingHours,
      totalMachineryExpenses: totalExpenses,
      recentLogs: logs.slice(0, 6)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
