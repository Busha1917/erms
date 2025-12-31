const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  // Get notifications for specific user OR their role
  const notifications = await Notification.find({
    $or: [
      { targetUserId: req.user._id },
      { targetRole: req.user.role },
      { targetRole: { $in: [req.user.role] } } // Handle array roles if needed
    ]
  }).sort({ createdAt: -1 }).limit(50);
  
  res.json(notifications);
};

const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification) {
    notification.read = true;
    await notification.save();
    res.json({ message: 'Marked as read' });
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

module.exports = { getNotifications, markAsRead };