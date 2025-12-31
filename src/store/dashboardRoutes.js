const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('./dashboardController');
const { protect, authorize } = require('./authMiddleware');

router.get('/', protect, authorize('admin'), getDashboardStats);

module.exports = router;