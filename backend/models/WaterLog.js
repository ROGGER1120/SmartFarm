import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  cropName: { type: String, default: 'Sunflower' },
  fieldName: { type: String, default: 'Field 1' },
  date: { type: Date, default: Date.now },
  source: { 
    type: String, 
    enum: ['Borewell', 'Canal Irrigation', 'Drip System', 'Sprinkler', 'Farm Pond', 'Rainwater Harvesting'], 
    default: 'Drip System' 
  },
  durationHours: { type: Number, required: true },
  quantityLiters: { type: Number, required: true },
  plannedLiters: { type: Number, required: true },
  cost: { type: Number, required: true, default: 0 },
  abnormalFlag: { type: Boolean, default: false },
  abnormalReason: { type: String },
  moistureBefore: { type: Number, default: 28 }, // Soil moisture %
  moistureAfter: { type: Number, default: 65 },
  notes: { type: String }
}, { timestamps: true });

// Auto-flag abnormal consumption if actual > 120% of planned
waterLogSchema.pre('save', function () {
  if (this.plannedLiters && this.quantityLiters > this.plannedLiters * 1.2) {
    this.abnormalFlag = true;
    if (!this.abnormalReason) {
      this.abnormalReason = `Actual usage (${this.quantityLiters.toLocaleString()} L) exceeded planned by ${Math.round(((this.quantityLiters - this.plannedLiters) / this.plannedLiters) * 100)}%`;
    }
  }
});

export default mongoose.model('WaterLog', waterLogSchema);
