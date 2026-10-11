import express from 'express';
import { 
  getBudgets, 
  getActiveBudget, 
  createOrUpdateBudget, 
  getBudgetVsActualAnalysis 
} from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', getBudgets);
router.get('/active', getActiveBudget);
router.post('/', createOrUpdateBudget);
router.get('/analysis', getBudgetVsActualAnalysis);

export default router;
