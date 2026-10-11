import mongoose from 'mongoose';

const fertilizerLogSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  fertilizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fertilizer', required: true },
  fertilizerName: { type: String, required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  cropName: { type: String, default: 'Sunflower' },
  fieldName: { type: String, default: 'Field 1' },
  date: { type: Date, default: Date.now },
  quantityUsed: { type: Number, required: true },
  unit: { type: String, default: 'Bags (50kg)' },
  costPerUnit: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  applicationMethod: { 
    type: String, 
    enum: ['Basal Dressing', 'Top Dressing', 'Fertigation (Drip)', 'Foliar Spray', 'Broadcasting'], 
    default: 'Basal Dressing' 
  },
  growthStageApplied: { type: String, default: 'Vegetative' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('FertilizerLog', fertilizerLogSchema);
