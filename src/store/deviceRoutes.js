const express = require('express');
const router = express.Router();
const { getDevices, createDevice, updateDevice, deleteDevice, restoreDevice } = require('./deviceController');
const { protect, authorize } = require('./authMiddleware');

router.route('/')
  .get(protect, getDevices)
  .post(protect, authorize('admin'), createDevice);
router.route('/:id')
  .put(protect, authorize('admin'), updateDevice)
  .delete(protect, authorize('admin'), deleteDevice);

router.put('/:id/restore', protect, authorize('admin'), restoreDevice);

module.exports = router;