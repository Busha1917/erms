const mongoose = require('mongoose');

const repairRequestSchema = mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  requestedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issue: { type: String, required: true },
  detailedDescription: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { 
    type: String, 
    enum: ['Pending', 'Diagnosing', 'In Progress', 'Waiting for Parts', 'Completed', 'Rejected', 'Cancelled'], 
    default: 'Pending' 
  },
  repairStage: { type: String },
  problemCategory: { type: String },
  serviceType: { type: String },
  address: { type: String },
  internalNotes: [{
    note: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  partsUsed: [{
    partId: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart' },
    quantity: Number,
    date: { type: Date, default: Date.now }
  }],
  logs: [{
    action: String,
    details: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  completedDate: { type: Date },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('RepairRequest', repairRequestSchema);