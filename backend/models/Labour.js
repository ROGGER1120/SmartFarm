import mongoose from 'mongoose';

const labourSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Weeding & De-trashing', 'Harvesting', 'Spraying Specialist', 'Tractor Operator', 'Irrigation Handler', 'Transplanting / Sowing', 'General Farm Hand'], 
    default: 'General Farm Hand' 
  },
  dailyWage: { type: Number, required: true, default: 500 },
  phone: { type: String, default: '+91 94432 10987' },
  status: { type: String, enum: ['Active', 'Seasonal', 'Inactive'], default: 'Active' },
  assignedField: { type: String, default: 'Field 1' },
  emergencyContact: { type: String },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Labour', labourSchema);
