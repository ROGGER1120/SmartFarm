import express from 'express';
import { getFarmExpenseReport, getCropProductionReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/expenses', getFarmExpenseReport);
router.get('/crops', getCropProductionReport);

export default router;
