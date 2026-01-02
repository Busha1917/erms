const Device = require('./Device');
const asyncHandler = require('./asyncHandler');

const getDevices = asyncHandler(async (req, res) => {
  const { deleted } = req.query;
  const query = {};
  const userId = req.user._id || req.user.id;
  
  if (deleted !== 'true') {
    query.isDeleted = false;
  }

  // Scope to logged-in user if not admin/technician
  if (req.user && req.user.role === 'user') {
    query.assignedToId = userId;
  }

  const devices = await Device.find(query).populate('assignedToId', 'name email department');
  res.json(devices);
});

const createDevice = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const deviceData = { ...req.body };
  
  // If a regular user creates a device, assign it to them automatically
  if (req.user && req.user.role === 'user') {
    deviceData.assignedToId = userId;
    deviceData.status = 'Active'; // Default status
  }

  const device = new Device(deviceData);
  const createdDevice = await device.save();
  res.status(201).json(createdDevice);
});

const updateDevice = asyncHandler(async (req, res) => {
  const device = await Device.findById(req.params.id);
  if (!device) return res.status(404).json({ message: 'Device not found' });

  const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedToId', 'name email department');
  res.json(updatedDevice);
});

const deleteDevice = asyncHandler(async (req, res) => {
  const device = await Device.findById(req.params.id);
  if (!device) return res.status(404).json({ message: 'Device not found' });

  device.isDeleted = true;
  device.status = 'Retired';
  await device.save();
  res.json({ message: 'Device removed' });
});

const restoreDevice = asyncHandler(async (req, res) => {
  const device = await Device.findById(req.params.id);
  if (!device) return res.status(404).json({ message: 'Device not found' });

  device.isDeleted = false;
  device.status = 'Active';
  await device.save();
  res.json({ message: 'Device restored' });
});

module.exports = { getDevices, createDevice, updateDevice, deleteDevice, restoreDevice };