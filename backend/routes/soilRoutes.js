import express from 'express';
import { getSoilReport, updateSoilReport, generateSummary } from '../controllers/soilController.js';

const router = express.Router();

router.get('/', getSoilReport);
router.put('/:id', updateSoilReport);
router.post('/generate-summary', generateSummary);

export default router;
