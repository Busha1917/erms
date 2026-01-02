const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('./notificationController');
const { protect } = require('./authMiddleware');

router.route('/')
  .get(protect, getNotifications)
  .put(protect, markAllAsRead);

router.route('/:id/read').put(protect, markAsRead);

module.exports = router;