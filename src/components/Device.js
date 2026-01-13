const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  deviceName: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  condition: { type: String },
  status: { type: String, default: 'Active' },
  assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);