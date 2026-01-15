const RepairRequest = require('../models/RepairRequest');
const Device = require('../models/Device');
const Notification = require('../models/Notification');

const getRequests = async (req, res) => {
  let query = { isDeleted: false };

  if (req.user.role === 'technician') {
    query.assignedToId = req.user._id;
  } else if (req.user.role === 'user') {
    query.requestedById = req.user._id;
  }
  // Admin gets all non-deleted requests

  const requests = await RepairRequest.find(query).populate('deviceId', 'deviceName serialNumber').populate('requestedById', 'name').sort({ createdAt: -1 });
  res.json(requests);
};

const getRequestById = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  // Access Control
  if (req.user.role !== 'admin' &&
      request.requestedById.toString() !== req.user._id.toString() &&
      request.assignedToId?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to view this request' });
  }
  res.json(request);
};

const createRequest = async (req, res) => {
  try {
    const { deviceId, issue, detailedDescription, priority } = req.body;
    
    if (!deviceId || !issue || !detailedDescription) {
        return res.status(400).json({ message: 'Missing required fields: device, issue, and description.' });
    }

    const device = await Device.findById(deviceId);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    const request = new RepairRequest({
      deviceId,
      issue,
      detailedDescription,
      priority: priority || 'Medium',
      requestedById: req.user._id,
    });

    const createdRequest = await request.save();
    console.log(`[PERSISTENCE] Repair request saved to DB: ${createdRequest._id}`);
    
    // Notify Admins (non-critical)
    try {
      await Notification.create({
        title: 'New Repair Request',
        message: `User ${req.user.name} submitted a request for device S/N: ${device.serialNumber}.`,
        recipientRole: 'admin',
        type: 'REPAIR_CREATED',
        relatedEntity: createdRequest._id
      });
    } catch (notifError) {
      console.error("Notification creation failed (non-critical):", notifError.message);
    }

    res.status(201).json(createdRequest);
  } catch (error) {
    console.error("Create Request Error:", error);
    res.status(500).json({ message: "Server Error processing request" });
  }
};

const updateRequest = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  const originalStatus = request.status;
  const originalAssignee = request.assignedToId?.toString();

  const updatedRequest = await RepairRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  // Status Change Notification
  if (req.body.status && req.body.status !== originalStatus) {
    await Notification.create({
      title: 'Repair Status Updated',
      message: `Your repair request status was updated to "${req.body.status}".`,
      recipientId: request.requestedById,
      type: 'REPAIR_STATUS_CHANGE',
      relatedEntity: updatedRequest._id
    });
  }
  
  // Assignment Notification
  if (req.body.assignedToId && req.body.assignedToId !== originalAssignee) {
     await Notification.create({
      title: 'New Repair Assignment',
      message: `You have been assigned a new repair request.`,
      recipientId: req.body.assignedToId,
      type: 'REPAIR_ASSIGNED',
      relatedEntity: updatedRequest._id
    });
  }

  res.json(updatedRequest);
};

module.exports = { getRequests, getRequestById, createRequest, updateRequest };