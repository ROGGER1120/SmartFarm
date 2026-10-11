import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import farmRoutes from './routes/farmRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import fertilizerRoutes from './routes/fertilizerRoutes.js';
import labourRoutes from './routes/labourRoutes.js';
import machineryRoutes from './routes/machineryRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import soilRoutes from './routes/soilRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import Farm from './models/Farm.js';
import { seedDatabase } from './seed/seedData.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/fertilizers', fertilizerRoutes);
app.use('/api/labour', labourRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/seed', seedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'SmartFarm - Farm Resource Management & Optimization System',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  // Auto seed if database is empty
  const farmCount = await Farm.countDocuments();
  if (farmCount === 0) {
    console.log('No farms found in database. Auto-populating initial data...');
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`SmartFarm Backend Server running on port ${PORT}`);
  });
};

startServer();
