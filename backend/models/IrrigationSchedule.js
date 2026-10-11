import mongoose from 'mongoose';

const irrigationScheduleSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  cropName: { type: String, default: 'Sunflower' },
  fieldName: { type: String, required: true },
  frequency: { type: String, enum: ['Daily', 'Alternate Days', 'Every 3 Days', 'Weekly', 'Bi-weekly'], default: 'Alternate Days' },
  irrigationTime: { type: String, default: '06:00 AM' },
  durationMinutes: { type: Number, default: 90 },
  plannedLiters: { type: Number, default: 2500 },
  method: { type: String, enum: ['Drip Line', 'Micro-Sprinkler', 'Furrow Flood', 'Overhead Sprinkler'], default: 'Drip Line' },
  valveZone: { type: String, default: 'Valve Zone A-North' },
  status: { type: String, enum: ['Active', 'Paused', 'Scheduled'], default: 'Active' },
  lastCompleted: { type: Date }
}, { timestamps: true });

export default mongoose.model('IrrigationSchedule', irrigationScheduleSchema);
