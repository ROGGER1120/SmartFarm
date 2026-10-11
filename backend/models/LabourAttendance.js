import mongoose from 'mongoose';

const labourAttendanceSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labour', required: true },
  labourName: { type: String, required: true },
  role: { type: String, default: 'General Farm Hand' },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  cropName: { type: String, default: 'Sunflower' },
  fieldName: { type: String, default: 'Field 1' },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Present', 'Half-Day', 'Absent', 'Overtime'], default: 'Present' },
  hoursWorked: { type: Number, default: 8 },
  taskDescription: { type: String, default: 'Weeding and mulching along row borders' },
  wagePaid: { type: Number, required: true, default: 500 },
  paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' }
}, { timestamps: true });

export default mongoose.model('LabourAttendance', labourAttendanceSchema);
