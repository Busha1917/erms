const RepairRequest = require('./RepairRequest');
const Inventory = require('./Inventory');
const Device = require('./Device');
const Notification = require('./Notification');
const asyncHandler = require('./asyncHandler');

const getRequests = asyncHandler(async (req, res) => {
  const query = { isDeleted: false };
  const userId = req.user._id || req.user.id;

  // Scope to logged-in user
  if (req.user.role === 'user') {
    query.requestedById = userId;
  }
  // Technicians see assigned tasks
  if (req.user.role === 'technician') {
    query.assignedToId = userId;
  }

  const requests = await RepairRequest.find(query).sort({ createdAt: -1 });
  res.json(requests);
});

const createRequest = async (req, res) => {
  console.log("🚨 REPAIR CONTROLLER HIT");
  console.log("📦 Body:", JSON.stringify(req.body, null, 2));
  console.log("👤 User:", req.user);
  console.log("🔑 Auth Header:", req.headers.authorization);

  try {
    if (!req.user) {
      console.error("❌ User is undefined in controller (Middleware failure?)");
      return res.status(401).json({ message: "User not authenticated." });
    }

    const userId = req.user._id || req.user.id;
    
    // Destructure to whitelist fields and avoid bad data (like empty strings for ObjectIds)
    const { 
      deviceId, 
      issue, 
      detailedDescription, 
      priority, 
      problemCategory, 
      serviceType, 
      address, 
      assignedToId 
    } = req.body;

    // Validate Device Existence
    if (deviceId) {
      const deviceExists = await Device.findById(deviceId);
      if (!deviceExists) {
        console.error(`❌ Device not found: ${deviceId}`);
        return res.status(404).json({ message: "Device not found" });
      }
    }

    const requestData = {
      deviceId,
      requestedById: userId,
      issue,
      detailedDescription: detailedDescription || "",
      priority: priority || 'Medium',
      problemCategory: problemCategory || 'Hardware',
      serviceType: serviceType || 'Repair',
      address: address || (req.user.address || ""),
      status: 'Pending',
      repairStage: 'Diagnosing'
    };

    // Only attach assignedToId if it is a valid string (not empty, not null)
    if (assignedToId && typeof assignedToId === 'string' && assignedToId.trim() !== "") {
      requestData.assignedToId = assignedToId;
    }
    
    console.log("💾 Saving RepairRequest:", JSON.stringify(requestData, null, 2));

    const request = await RepairRequest.create(requestData);
    console.log("✅ REPAIR SAVED:", request._id);

    // Notify Admins about new request
    try {
      await Notification.create({
        recipientRole: 'admin',
        message: `New Repair Request from ${req.user.name}: ${issue}`,
        type: 'info',
        relatedId: request._id,
        relatedModel: 'RepairRequest'
      });
    } catch (notifError) {
      console.warn("⚠️ [NOTIFICATION] Failed to send (non-critical):", notifError.message);
    }

    res.status(201).json(request);
  } catch (error) {
    console.error("🔥 REPAIR SAVE FAILED");
    console.error("Error Message:", error.message);
    console.error("Stack:", error.stack);
    
    res.status(500).json({
      error: "Repair creation failed",
      details: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

const updateRequest = asyncHandler(async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);
  const userId = req.user._id || req.user.id;
  
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // User can only cancel pending requests
  if (req.user.role === 'user') {
    if (String(request.requestedById) !== String(userId)) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Handle Cancellation
    if (req.body.status === 'Cancelled') {
       if (request.status === 'Pending') {
         request.status = 'Cancelled';
       } else if (request.status !== 'Cancelled') {
         res.status(400);
         throw new Error('Users can only cancel pending requests');
       }
       
       // Notify Admin/Technician of cancellation
       await Notification.create({
         recipientRole: 'admin',
         message: `Request #${request._id} cancelled by user ${req.user.name}`,
         type: 'warning',
         relatedId: request._id,
         relatedModel: 'RepairRequest'
       });
    }

    // Handle Comments (Allow users to add comments)
    if (req.body.comments) {
      request.comments = req.body.comments;
    }

    // Save changes (ignoring other fields for users)
    await request.save();
    return res.json(request);
  }

  // Technician/Admin: Inventory Deduction Logic
  if (req.body.partsUsed) {
    const oldParts = request.partsUsed || [];
    const newParts = req.body.partsUsed || [];
    
    // Map partId -> quantity for old parts
    const oldMap = {};
    oldParts.forEach(p => {
      const pId = p.id || p._id;
      oldMap[pId] = (oldMap[pId] || 0) + Number(p.quantity);
    });
    
    for (const part of newParts) {
      const partId = part.id || part._id;
      const newQty = Number(part.quantity);
      const oldQty = oldMap[partId] || 0;
      
      if (newQty > oldQty) {
        const diff = newQty - oldQty;
        const inventoryItem = await Inventory.findById(partId);
        
        if (!inventoryItem) {
           res.status(400);
           throw new Error(`Part not found: ${part.name}`);
        }
        if (inventoryItem.quantity < diff) {
           res.status(400);
           throw new Error(`Insufficient stock for ${part.name}. Available: ${inventoryItem.quantity}`);
        }
        inventoryItem.quantity -= diff;
        await inventoryItem.save(); // Pre-save hook will update status
      }
    }
  }

  // Admin/Technician logic
  const updatedRequest = await RepairRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });

  // Notify User if status changed
  if (req.body.status && req.body.status !== request.status) {
    await Notification.create({
      recipientUserId: request.requestedById,
      message: `Your repair request #${request._id} is now ${req.body.status}`,
      type: 'info',
      relatedId: request._id,
      relatedModel: 'RepairRequest'
    });
  }

  // Notify Technician if assigned
  if (req.body.assignedToId && String(req.body.assignedToId) !== String(request.assignedToId)) {
    await Notification.create({
      recipientUserId: req.body.assignedToId,
      message: `You have been assigned to repair request #${request._id}`,
      type: 'info',
      relatedId: request._id,
      relatedModel: 'RepairRequest'
    });
  }

  res.json(updatedRequest);
});

const getRequestById = asyncHandler(async (req, res) => { /* Implement if needed */ });

module.exports = { getRequests, createRequest, updateRequest };