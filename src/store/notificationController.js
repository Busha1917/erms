const Notification = require('./Notification');
const asyncHandler = require('./asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const userRole = req.user.role;

  // Fetch notifications targeted to the specific user OR their role
  const notifications = await Notification.find({
    $or: [
      { recipientUserId: userId },
      { recipientRole: userRole }
    ]
  }).sort({ createdAt: -1 }).limit(50);

  res.json(notifications);
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.read = true;
  await notification.save();
  res.json(notification);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const userRole = req.user.role;

  await Notification.updateMany({
    $or: [
      { recipientUserId: userId },
      { recipientRole: userRole }
    ],
    read: false
  }, { read: true });

  res.json({ message: 'All notifications marked as read' });
});

module.exports = { getNotifications, markAsRead, markAllAsRead };