import express from 'express';
import { getFarms, getFarmById, createFarm, updateFarm, deleteFarm, addFieldToFarm } from '../controllers/farmController.js';

const router = express.Router();

router.get('/', getFarms);
router.get('/:id', getFarmById);
router.post('/', createFarm);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);
router.post('/:id/fields', addFieldToFarm);

export default router;
