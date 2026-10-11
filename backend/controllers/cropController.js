import Crop from '../models/Crop.js';

export const getCrops = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    if (req.query.status) filter.status = req.query.status;

    const crops = await Crop.find(filter).sort({ sowingDate: -1 });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCrop = async (req, res) => {
  try {
    const crop = new Crop(req.body);
    const savedCrop = await crop.save();
    res.status(201).json(savedCrop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCrop = async (req, res) => {
  try {
    const updated = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Crop not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCropStage = async (req, res) => {
  try {
    const { stage, stageProgress, notes } = req.body;
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });

    if (stage) crop.stage = stage;
    if (stageProgress !== undefined) crop.stageProgress = stageProgress;
    if (notes) crop.notes = notes;
    if (stage === 'Harvested' && !crop.actualHarvestDate) {
      crop.actualHarvestDate = new Date();
      crop.status = 'Harvested';
    }

    await crop.save();
    res.json(crop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const recordYield = async (req, res) => {
  try {
    const { actualYield, yieldUnit, actualRevenue, actualHarvestDate } = req.body;
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });

    crop.actualYield = actualYield;
    if (yieldUnit) crop.yieldUnit = yieldUnit;
    if (actualRevenue) crop.actualRevenue = actualRevenue;
    crop.actualHarvestDate = actualHarvestDate || new Date();
    crop.stage = 'Harvested';
    crop.stageProgress = 100;
    crop.status = 'Harvested';

    await crop.save();
    res.json(crop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const deleted = await Crop.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Crop not found' });
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
