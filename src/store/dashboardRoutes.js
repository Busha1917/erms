const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('./dashboardController');
const { protect } = require('./authMiddleware');

router.get('/', protect, getDashboardStats);

module.exports = router;