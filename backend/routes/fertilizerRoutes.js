import express from 'express';
import { 
  getFertilizers, 
  addFertilizer, 
  updateFertilizer, 
  deleteFertilizer, 
  getFertilizerLogs, 
  logApplication, 
  getFertilizerAlertsAndStats 
} from '../controllers/fertilizerController.js';

const router = express.Router();

router.get('/', getFertilizers);
router.post('/', addFertilizer);
router.put('/:id', updateFertilizer);
router.delete('/:id', deleteFertilizer);
router.get('/logs', getFertilizerLogs);
router.post('/apply', logApplication);
router.get('/stats', getFertilizerAlertsAndStats);

export default router;
