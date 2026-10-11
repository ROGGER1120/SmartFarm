import mongoose from 'mongoose';

const soilReportSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  fieldName: { type: String, default: 'Field 1' },
  presentCrop: { type: String, default: 'Sunflower' },
  cropCategory: { type: String, default: 'Oilseed Crops' },
  testDate: { type: Date, default: Date.now },
  soilPh: { type: Number, default: 6.5 },
  soilPhBenchmark: { type: String, default: '6.0 to 7.5' },
  soilEcLevel: { type: Number, default: 0.5 }, // ds/m
  soilEcBenchmark: { type: String, default: '< 1 ds/m' },
  organicCarbon: { type: Number, default: 0.8 }, // %
  organicCarbonBenchmark: { type: String, default: '0.5 to 0.75%' },
  nitrogen: { type: Number, default: 240 }, // kg/ha
  nitrogenBenchmark: { type: String, default: '280 to 560 kg/ha' },
  nitrogenStatus: { type: String, enum: ['Low', 'Optimal', 'High'], default: 'Low' },
  phosphorous: { type: Number, default: 12 }, // kg/ha
  phosphorousBenchmark: { type: String, default: '22.5 to 56 kg/ha' },
  phosphorousStatus: { type: String, enum: ['Low', 'Optimal', 'High'], default: 'Low' },
  potassium: { type: Number, default: 200 }, // kg/ha
  potassiumBenchmark: { type: String, default: '120 to 280 kg/ha' },
  potassiumStatus: { type: String, enum: ['Low', 'Optimal', 'High'], default: 'Optimal' },
  recommendations: [
    {
      nutrient: { type: String, default: 'Nitrogen (N)' },
      deficiencyLevel: { type: String, default: 'Deficit by 40 kg/ha' },
      suggestedFertilizer: { type: String, default: 'Apply Neem-Coated Urea (85 kg/ha) in split doses' },
      priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
    },
    {
      nutrient: { type: String, default: 'Phosphorous (P)' },
      deficiencyLevel: { type: String, default: 'Deficit by 10.5 kg/ha' },
      suggestedFertilizer: { type: String, default: 'Apply Single Super Phosphate (SSP) or DAP prior to flowering' },
      priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
    },
    {
      nutrient: { type: String, default: 'Potassium (K)' },
      deficiencyLevel: { type: String, default: 'Optimal Range' },
      suggestedFertilizer: { type: String, default: 'Maintain current MOP (Muriate of Potash) basal dosage' },
      priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' }
    }
  ]
}, { timestamps: true });

export default mongoose.model('SoilReport', soilReportSchema);
