import mongoose from 'mongoose';

const machineryLogSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  machineryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machinery', required: true },
  machineryName: { type: String, required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  cropName: { type: String, default: 'Sunflower' },
  fieldName: { type: String, default: 'Field 1' },
  date: { type: Date, default: Date.now },
  hoursRun: { type: Number, required: true, default: 4 },
  fuelConsumedLiters: { type: Number, default: 8 },
  fuelExpense: { type: Number, required: true, default: 760 },
  maintenanceExpense: { type: Number, default: 0 },
  totalExpense: { type: Number, required: true, default: 760 },
  operatorName: { type: String, default: 'Muthu (Driver)' },
  activityType: { 
    type: String, 
    enum: ['Ploughing / Deep Tilling', 'Harrowing / Rotavation', 'Bed Formation', 'Spraying', 'Harvesting', 'Transport / Haulage'], 
    default: 'Ploughing / Deep Tilling' 
  },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('MachineryLog', machineryLogSchema);
