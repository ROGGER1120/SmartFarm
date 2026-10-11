import express from 'express';
import { 
  getWaterLogs, 
  addWaterLog, 
  deleteWaterLog, 
  getIrrigationSchedules, 
  addIrrigationSchedule, 
  updateIrrigationSchedule, 
  deleteIrrigationSchedule, 
  getWaterMetrics 
} from '../controllers/waterController.js';

const router = express.Router();

router.get('/logs', getWaterLogs);
router.post('/logs', addWaterLog);
router.delete('/logs/:id', deleteWaterLog);
router.get('/schedules', getIrrigationSchedules);
router.post('/schedules', addIrrigationSchedule);
router.put('/schedules/:id', updateIrrigationSchedule);
router.delete('/schedules/:id', deleteIrrigationSchedule);
router.get('/metrics', getWaterMetrics);

export default router;
