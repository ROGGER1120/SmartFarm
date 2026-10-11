import mongoose from 'dotenv';
import connectDB from '../config/db.js';
import { seedDatabase } from './seedData.js';

const runSeed = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};

runSeed();
