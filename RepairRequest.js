const mongoose = require('mongoose');

const repairRequestSchema = mongoose.Schema({
  requestedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  issue: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Approved', 'In Progress', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Pending' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  
  problemCategory: { type: String },
  serviceType: { type: String },
  isDeleted: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('RepairRequest', repairRequestSchema);