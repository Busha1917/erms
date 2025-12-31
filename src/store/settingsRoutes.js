const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('./settingsController');
const { protect, authorize } = require('./authMiddleware');

router.route('/')
  .get(protect, authorize('admin'), getSettings)
  .put(protect, authorize('admin'), updateSettings);

module.exports = router;