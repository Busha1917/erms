const Inventory = require('./Inventory');
const Notification = require('./Notification');
const asyncHandler = require('./asyncHandler');

const getInventory = asyncHandler(async (req, res) => {
  const parts = await Inventory.find({}).sort({ createdAt: -1 });
  res.json(parts);
});

const addPart = asyncHandler(async (req, res) => {
  const part = await Inventory.create(req.body);
  res.status(201).json(part);
});

const updatePart = asyncHandler(async (req, res) => {
  const part = await Inventory.findById(req.params.id);
  if (!part) {
    res.status(404);
    throw new Error('Part not found');
  }
  
  const updatedPart = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  // Re-evaluate status based on new quantity
  if (updatedPart.quantity === 0) updatedPart.status = 'Out of Stock';
  else if (updatedPart.quantity <= updatedPart.minStock) updatedPart.status = 'Low Stock';
  else updatedPart.status = 'In Stock';
  
  await updatedPart.save();

  // Low Stock Alert
  if (updatedPart.quantity <= updatedPart.minStock) {
    await Notification.create({
      recipientRole: 'admin',
      message: `Low Stock Alert: ${updatedPart.name} is down to ${updatedPart.quantity}`,
      type: 'warning',
      relatedId: updatedPart._id,
      relatedModel: 'Inventory'
    });
  }

  res.json(updatedPart);
});

const deletePart = asyncHandler(async (req, res) => {
  const part = await Inventory.findById(req.params.id);
  if (!part) {
    res.status(404);
    throw new Error('Part not found');
  }
  await part.deleteOne();
  res.json({ message: 'Part removed' });
});

module.exports = { getInventory, addPart, updatePart, deletePart };