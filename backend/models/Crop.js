import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true },
  variety: { type: String, default: 'Hybrid Gold' },
  category: { type: String, default: 'Oilseed Crops', enum: ['Cereals & Grains', 'Pulses', 'Oilseed Crops', 'Vegetables', 'Fruits', 'Commercial Crops'] },
  season: { type: String, default: 'Kharif', enum: ['Kharif', 'Rabi', 'Zaid', 'Perennial'] },
  fieldName: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date, required: true },
  actualHarvestDate: { type: Date },
  stage: { 
    type: String, 
    enum: ['Land Preparation', 'Sowing / Seedling', 'Vegetative Growth', 'Flowering & Budding', 'Grain / Pod Formation', 'Maturity', 'Harvested'], 
    default: 'Vegetative Growth' 
  },
  stageProgress: { type: Number, default: 45, min: 0, max: 100 },
  areaCultivated: { type: Number, default: 2.5 },
  estimatedYield: { type: Number, default: 25 },
  actualYield: { type: Number, default: 0 },
  yieldUnit: { type: String, default: 'Quintals', enum: ['Quintals', 'Bags (50kg)', 'Metric Tons', 'Kg'] },
  marketPricePerUnit: { type: Number, default: 5800 },
  actualRevenue: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Harvested', 'Planning', 'Damaged'], default: 'Active' },
  healthStatus: { type: String, enum: ['Excellent', 'Good', 'Attention Needed', 'Pest Alert'], default: 'Good' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Crop', cropSchema);
