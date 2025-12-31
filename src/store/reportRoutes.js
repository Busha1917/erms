const express = require('express');
const router = express.Router();
const { getReports } = require('./reportController');
const { protect, authorize } = require('./authMiddleware');

router.get('/', protect, authorize('admin'), getReports);

module.exports = router;