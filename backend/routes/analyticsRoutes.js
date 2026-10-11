import express from 'express';
import { getDashboardSummary, getChartsData } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/summary', getDashboardSummary);
router.get('/charts', getChartsData);

export default router;
