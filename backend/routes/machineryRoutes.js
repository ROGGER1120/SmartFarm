import express from 'express';
import { 
  getMachineryList, 
  addMachinery, 
  updateMachinery, 
  deleteMachinery, 
  getMachineryLogs, 
  logMachineryUsage, 
  getMachineryAlertsAndStats 
} from '../controllers/machineryController.js';

const router = express.Router();

router.get('/', getMachineryList);
router.post('/', addMachinery);
router.put('/:id', updateMachinery);
router.delete('/:id', deleteMachinery);
router.get('/logs', getMachineryLogs);
router.post('/logs', logMachineryUsage);
router.get('/stats', getMachineryAlertsAndStats);

export default router;
