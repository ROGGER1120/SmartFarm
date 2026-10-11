import express from 'express';
import { seedDatabase } from '../seed/seedData.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
