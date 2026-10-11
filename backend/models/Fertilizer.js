import mongoose from 'mongoose';

const fertilizerSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Nitrogenous (N)', 'Phosphatic (P)', 'Potassic (K)', 'NPK Complex', 'Organic Compost', 'Bio-Fertilizer', 'Micronutrient'], 
    default: 'NPK Complex' 
  },
  currentStock: { type: Number, required: true, default: 0 },
  unit: { type: String, enum: ['Kg', 'Bags (50kg)', 'Liters', 'Packets'], default: 'Bags (50kg)' },
  minThresholdStock: { type: Number, required: true, default: 5 },
  pricePerUnit: { type: Number, required: true, default: 1200 },
  npkRatio: { type: String, default: '19:19:19' },
  supplier: { type: String, default: 'AgriCoop Center' },
  expiryDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Fertilizer', fertilizerSchema);
