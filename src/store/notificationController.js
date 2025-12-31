const Notification = require('./Notification');

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    $or: [
      { targetUserId: req.user._id },
      { targetRole: req.user.role },
      { targetRole: { $in: [req.user.role] } }
    ]
  }).sort({ createdAt: -1 }).limit(50);
  
  res.json(notifications);
};

const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification) {
    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

const markAllAsRead = async (req, res) => {
  await Notification.updateMany({ targetUserId: req.user._id, isRead: false }, { $set: { isRead: true } });
  res.json({ message: 'All notifications marked as read' });
};

module.exports = { getNotifications, markAsRead, markAllAsRead };