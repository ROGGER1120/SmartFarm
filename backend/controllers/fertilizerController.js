import Fertilizer from '../models/Fertilizer.js';
import FertilizerLog from '../models/FertilizerLog.js';

export const getFertilizers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    const items = await Fertilizer.find(filter).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFertilizer = async (req, res) => {
  try {
    const item = new Fertilizer(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFertilizer = async (req, res) => {
  try {
    const updated = await Fertilizer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Fertilizer not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFertilizer = async (req, res) => {
  try {
    const deleted = await Fertilizer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Fertilizer not found' });
    res.json({ message: 'Fertilizer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFertilizerLogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    if (req.query.fertilizerId) filter.fertilizerId = req.query.fertilizerId;
    const logs = await FertilizerLog.find(filter).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logApplication = async (req, res) => {
  try {
    const { farmId, fertilizerId, cropId, cropName, fieldName, date, quantityUsed, applicationMethod, notes } = req.body;
    
    const fertilizer = await Fertilizer.findById(fertilizerId);
    if (!fertilizer) return res.status(404).json({ message: 'Fertilizer product not found' });

    // Deduct stock
    fertilizer.currentStock = Math.max(0, fertilizer.currentStock - Number(quantityUsed));
    await fertilizer.save();

    const costPerUnit = fertilizer.pricePerUnit;
    const totalCost = Number(quantityUsed) * costPerUnit;

    const log = new FertilizerLog({
      farmId,
      fertilizerId,
      fertilizerName: fertilizer.name,
      cropId,
      cropName: cropName || 'Sunflower',
      fieldName: fieldName || 'Field 1',
      date: date || new Date(),
      quantityUsed: Number(quantityUsed),
      unit: fertilizer.unit,
      costPerUnit,
      totalCost,
      applicationMethod: applicationMethod || 'Basal Dressing',
      notes
    });

    const savedLog = await log.save();

    // Check if stock is now below threshold
    const isLowStock = fertilizer.currentStock <= fertilizer.minThresholdStock;

    res.status(201).json({
      log: savedLog,
      updatedStock: fertilizer.currentStock,
      isLowStock,
      alertMessage: isLowStock ? `Warning: Stock for ${fertilizer.name} has fallen to ${fertilizer.currentStock} ${fertilizer.unit} (Below minimum threshold ${fertilizer.minThresholdStock})` : null
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFertilizerAlertsAndStats = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;

    const fertilizers = await Fertilizer.find(filter);
    const logs = await FertilizerLog.find(filter);

    const lowStockItems = fertilizers.filter(item => item.currentStock <= item.minThresholdStock);
    const totalInventoryValue = fertilizers.reduce((sum, item) => sum + (item.currentStock * item.pricePerUnit), 0);
    const totalAppliedExpense = logs.reduce((sum, item) => sum + (item.totalCost || 0), 0);

    res.json({
      totalProducts: fertilizers.length,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      totalInventoryValue,
      totalAppliedExpense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
