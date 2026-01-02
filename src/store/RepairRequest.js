const mongoose = require('mongoose');

const repairRequestSchema = mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  requestedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issue: { type: String, required: true },
  detailedDescription: { type: String },
  department: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Rejected', 'Cancelled'], default: 'Pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  problemCategory: { type: String, default: 'Hardware' },
  serviceType: { type: String, default: 'Repair' },
  repairStage: { type: String, default: 'Diagnosing' },
  deadline: { type: String },
  adminInstructions: { type: String },
  comments: { type: Array, default: [] },
  partsUsed: { type: Array, default: [] },
  accepted: { type: Boolean, default: false },
  isPaused: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id; // Map _id to id for frontend compatibility
    }
  }
});

module.exports = mongoose.model('RepairRequest', repairRequestSchema);