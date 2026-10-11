import mongoose from 'mongoose';

const machinerySchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true },
  model: { type: String, default: 'Mahindra 575 DI / DJI Agras T40' },
  type: { 
    type: String, 
    enum: ['Tractor', 'Power Tiller', 'Rotavator', 'Drone Sprayer', 'Combine Harvester', 'Submersible Pump', 'Thresher', 'Baler'], 
    default: 'Tractor' 
  },
  registrationNumber: { type: String, default: 'TN-38-AF-9821' },
  hourlyRate: { type: Number, default: 600 },
  totalOperatingHours: { type: Number, default: 120 },
  fuelType: { type: String, enum: ['Diesel', 'Petrol', 'Electric', 'Battery Pack'], default: 'Diesel' },
  lastServiceDate: { type: Date },
  nextServiceDate: { type: Date },
  serviceIntervalHours: { type: Number, default: 150 },
  maintenanceStatus: { 
    type: String, 
    enum: ['Operational', 'Service Due', 'Under Maintenance', 'Breakdown'], 
    default: 'Operational' 
  },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Machinery', machinerySchema);
