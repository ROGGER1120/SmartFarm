import express from 'express';
import { 
  getLabourList, 
  addLabour, 
  updateLabour, 
  deleteLabour, 
  getAttendanceRecords, 
  recordAttendance, 
  getLabourStats 
} from '../controllers/labourController.js';

const router = express.Router();

router.get('/', getLabourList);
router.post('/', addLabour);
router.put('/:id', updateLabour);
router.delete('/:id', deleteLabour);
router.get('/attendance', getAttendanceRecords);
router.post('/attendance', recordAttendance);
router.get('/stats', getLabourStats);

export default router;
