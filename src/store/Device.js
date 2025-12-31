const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
  deviceName: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // Laptop, Phone, etc.
  brand: { type: String },
  model: { type: String },
  assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  condition: { type: String },
  status: { type: String, enum: ['Active', 'In Repair', 'Retired'], default: 'Active' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);