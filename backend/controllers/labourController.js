import Labour from '../models/Labour.js';
import LabourAttendance from '../models/LabourAttendance.js';

export const getLabourList = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    const list = await Labour.find(filter).sort({ name: 1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addLabour = async (req, res) => {
  try {
    const labour = new Labour(req.body);
    const saved = await labour.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLabour = async (req, res) => {
  try {
    const updated = await Labour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Labour worker not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLabour = async (req, res) => {
  try {
    const deleted = await Labour.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Labour worker not found' });
    res.json({ message: 'Labour removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceRecords = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;
    if (req.query.labourId) filter.labourId = req.query.labourId;
    const records = await LabourAttendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recordAttendance = async (req, res) => {
  try {
    const { farmId, labourId, date, status, hoursWorked, taskDescription, cropId, cropName, fieldName } = req.body;
    
    const worker = await Labour.findById(labourId);
    if (!worker) return res.status(404).json({ message: 'Labour not found' });

    let wageMultiplier = 1;
    if (status === 'Half-Day') wageMultiplier = 0.5;
    else if (status === 'Absent') wageMultiplier = 0;
    else if (status === 'Overtime') wageMultiplier = 1.3;

    const wagePaid = Math.round(worker.dailyWage * wageMultiplier);

    const record = new LabourAttendance({
      farmId,
      labourId,
      labourName: worker.name,
      role: worker.role,
      date: date || new Date(),
      status: status || 'Present',
      hoursWorked: hoursWorked || (status === 'Half-Day' ? 4 : status === 'Absent' ? 0 : 8),
      taskDescription: taskDescription || 'Field maintenance',
      cropId,
      cropName: cropName || 'Sunflower',
      fieldName: fieldName || 'Field 1',
      wagePaid
    });

    const saved = await record.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLabourStats = async (req, res) => {
  try {
    const filter = {};
    if (req.query.farmId) filter.farmId = req.query.farmId;

    const workers = await Labour.find(filter);
    const attendance = await LabourAttendance.find(filter);

    const totalWages = attendance.reduce((sum, item) => sum + (item.wagePaid || 0), 0);
    const totalWorkingDays = attendance.filter(item => item.status === 'Present' || item.status === 'Overtime').length;

    res.json({
      totalWorkers: workers.length,
      activeWorkers: workers.filter(w => w.status === 'Active').length,
      totalWorkingDays,
      totalWagesExpense: totalWages,
      recentAttendance: attendance.slice(0, 8)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
