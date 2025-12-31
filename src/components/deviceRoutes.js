const express = require('express');
const router = express.Router();
const { getDevices, createDevice, updateDevice, deleteDevice } = require('../controllers/deviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getDevices)
  .post(protect, authorize('admin'), createDevice);
router.route('/:id')
  .put(protect, authorize('admin'), updateDevice)
  .delete(protect, authorize('admin'), deleteDevice);

module.exports = router;