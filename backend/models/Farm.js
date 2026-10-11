import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, default: 'FARM-01' },
  location: { type: String, required: true },
  totalArea: { type: Number, required: true },
  areaUnit: { type: String, default: 'Acres', enum: ['Acres', 'Hectares', 'Cents'] },
  soilType: { type: String, default: 'Red Loamy Soil' },
  farmerName: { type: String, default: 'Farmer Arini' },
  contact: { type: String, default: '+91 98765 43210' },
  climateZone: { type: String, default: 'Tropical Semi-Arid' },
  fields: [
    {
      name: { type: String, required: true },
      area: { type: Number, required: true },
      soilType: { type: String, default: 'Loamy' },
      status: { type: String, enum: ['Active Cultivation', 'Fallow', 'Ploughing', 'Harvest Ready'], default: 'Active Cultivation' },
      currentCrop: { type: String, default: 'Sunflower' },
      cropCategory: { type: String, default: 'Oilseed Crops' },
      coordinates: {
        lat: { type: Number, default: 11.0168 },
        lng: { type: Number, default: 76.9558 }
      }
    }
  ],
  isPrimary: { type: Boolean, default: false },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Farm', farmSchema);
