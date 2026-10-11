import express from 'express';
import { getCrops, getCropById, createCrop, updateCrop, updateCropStage, recordYield, deleteCrop } from '../controllers/cropController.js';

const router = express.Router();

router.get('/', getCrops);
router.get('/:id', getCropById);
router.post('/', createCrop);
router.put('/:id', updateCrop);
router.patch('/:id/stage', updateCropStage);
router.patch('/:id/yield', recordYield);
router.delete('/:id', deleteCrop);

export default router;
