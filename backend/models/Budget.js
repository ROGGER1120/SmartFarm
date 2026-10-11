import mongoose from 'mongoose';

const budgetCategorySchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['Water', 'Fertilizer', 'Labour', 'Machinery', 'Seeds & Seedlings', 'Crop Protection', 'Harvest & Logistics', 'Miscellaneous'],
    required: true 
  },
  planned: { type: Number, required: true, default: 0 },
  actual: { type: Number, required: true, default: 0 },
  notes: { type: String, default: '' }
}, { _id: false });

const budgetSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  season: { type: String, default: 'Kharif 2026' },
  year: { type: Number, default: 2026 },
  cropName: { type: String, default: 'All Crops (Consolidated)' },
  categories: [budgetCategorySchema],
  totalPlanned: { type: Number, default: 0 },
  totalActual: { type: Number, default: 0 },
  currency: { type: String, default: '₹' },
  status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' },
  notes: { type: String }
}, { timestamps: true });

// Pre-save to compute totalPlanned and totalActual
budgetSchema.pre('save', function () {
  if (this.categories && this.categories.length > 0) {
    this.totalPlanned = this.categories.reduce((sum, item) => sum + (Number(item.planned) || 0), 0);
    this.totalActual = this.categories.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);
  }
});

export default mongoose.model('Budget', budgetSchema);
