const Device = require('../models/Device');

// @desc    Register new device
// @route   POST /api/devices
// @access  Private/Admin
const registerDevice = async (req, res) => {
  try {
    const { serialNumber, deviceName, type, brand, model, condition, status } = req.body;

    if (!serialNumber || !deviceName || !type) {
      res.status(400).json({ message: 'Please add all required fields' });
      return;
    }

    const deviceExists = await Device.findOne({ serialNumber });
    if (deviceExists) {
      res.status(400).json({ message: 'Device with this serial number already exists' });
      return;
    }

    const device = await Device.create({
      serialNumber, deviceName, type, brand, model, condition, status
    });

    console.log(`Device persisted to DB: ${device.serialNumber}`);
    res.status(201).json(device);
  } catch (error) {
    console.error("Error saving device:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all devices
// @route   GET /api/devices
// @access  Private
const getDevices = async (req, res) => {
  const devices = await Device.find().populate('assignedToId', 'name email');
  res.status(200).json(devices);
};

module.exports = { registerDevice, getDevices };