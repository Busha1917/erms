const Device = require('../models/Device');

const getDevices = async (req, res) => {
  let devices;
  if (req.user.role === 'admin') {
    devices = await Device.find({});
  } else {
    devices = await Device.find({ assignedToId: req.user._id });
  }
  res.json(devices);
};

const createDevice = async (req, res) => {
  const { deviceName, serialNumber, type, model, assignedToId, status } = req.body;
  const device = new Device({
    deviceName, serialNumber, type, model, assignedToId, status
  });
  const createdDevice = await device.save();
  res.status(201).json(createdDevice);
};

const updateDevice = async (req, res) => {
  const device = await Device.findById(req.params.id);
  if (device) {
    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDevice);
  } else {
    res.status(404).json({ message: 'Device not found' });
  }
};

const deleteDevice = async (req, res) => {
  const device = await Device.findById(req.params.id);
  if (device) {
    await device.deleteOne();
    res.json({ message: 'Device removed' });
  } else {
    res.status(404).json({ message: 'Device not found' });
  }
};

module.exports = { getDevices, createDevice, updateDevice, deleteDevice };