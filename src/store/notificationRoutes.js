const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('./notificationController');
const { protect } = require('./authMiddleware');

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', protect, getNotifications);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, markAllAsRead);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, markAsRead);

module.exports = router;