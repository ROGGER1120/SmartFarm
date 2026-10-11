import Farm from '../models/Farm.js';

export const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find().sort({ createdAt: -1 });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json(farm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFarm = async (req, res) => {
  try {
    const farm = new Farm(req.body);
    const savedFarm = await farm.save();
    res.status(201).json(savedFarm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFarm = async (req, res) => {
  try {
    const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFarm) return res.status(404).json({ message: 'Farm not found' });
    res.json(updatedFarm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const deleted = await Farm.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Farm not found' });
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFieldToFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    farm.fields.push(req.body);
    await farm.save();
    res.status(201).json(farm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
