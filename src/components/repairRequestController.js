const RepairRequest = require('../models/RepairRequest');
const Device = require('../models/Device');
const Notification = require('../models/Notification');

const getRequests = async (req, res) => {
  let requests;
  // Role-based filtering
  if (req.user.role === 'admin') {
    requests = await RepairRequest.find({ isDeleted: false }).sort({ createdAt: -1 });
  } else if (req.user.role === 'technician') {
    requests = await RepairRequest.find({ 
      assignedToId: req.user._id, 
      isDeleted: false 
    }).sort({ createdAt: -1 });
  } else {
    requests = await RepairRequest.find({ 
      requestedById: req.user._id, 
      isDeleted: false 
    }).sort({ createdAt: -1 });
  }
  res.json(requests);
};

const getRequestById = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);
  if (request) {
    // Access Control
    if (req.user.role !== 'admin' && 
        request.requestedById.toString() !== req.user._id.toString() && 
        request.assignedToId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }
    res.json(request);
  } else {
    res.status(404).json({ message: 'Request not found' });
  }
};

const createRequest = async (req, res) => {
  const { deviceId, issue, detailedDescription, priority, problemCategory, serviceType, address } = req.body;
  
  const device = await Device.findById(deviceId);
  if (!device) return res.status(404).json({ message: 'Device not found' });
  if (device.status === 'Suspended') return res.status(400).json({ message: 'Device is suspended' });

  const request = new RepairRequest({
    deviceId,
    requestedById: req.user._id,
    issue,
    detailedDescription,
    priority,
    problemCategory,
    serviceType,
    address: address || req.user.address,
    status: 'Pending',
    repairStage: 'Diagnosing'
  });

  const createdRequest = await request.save();
  
  // Notify Admins
  await Notification.create({
    targetRole: 'admin',
    message: `New repair request from ${req.user.name}: ${issue}`,
    date: new Date().toLocaleString()
  });

  res.status(201).json(createdRequest);
};

const updateRequest = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  // Update logic
  const updatedRequest = await RepairRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  // Status Change Notification
  if (req.body.status && req.body.status !== request.status) {
    await Notification.create({
      targetUserId: request.requestedById,
      message: `Your request #${request._id} status updated to ${req.body.status}`,
      date: new Date().toLocaleString()
    });
  }
  
  // Assignment Notification
  if (req.body.assignedToId && req.body.assignedToId !== request.assignedToId?.toString()) {
     await Notification.create({
      targetUserId: req.body.assignedToId,
      message: `You have been assigned to repair request #${request._id}`,
      date: new Date().toLocaleString()
    });
  }

  res.json(updatedRequest);
};

module.exports = { getRequests, getRequestById, createRequest, updateRequest };