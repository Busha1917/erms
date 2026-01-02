const asyncHandler = require('./asyncHandler');
const Device = require('./Device');
const RepairRequest = require('./RepairRequest');
const User = require('./User');

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  if (req.user.role === 'user') {
    // User Specific Stats
    const devicesCount = await Device.countDocuments({ assignedToId: userId, isDeleted: false });
    const requestsCount = await RepairRequest.countDocuments({ requestedById: userId, isDeleted: false });
    const pendingCount = await RepairRequest.countDocuments({ requestedById: userId, status: 'Pending', isDeleted: false });
    const completedCount = await RepairRequest.countDocuments({ requestedById: userId, status: 'Completed', isDeleted: false });
    
    const recentActivity = await RepairRequest.find({ requestedById: userId, isDeleted: false })
      .sort({ updatedAt: -1 })
      .limit(5);

    return res.json({
      stats: {
        devices: devicesCount,
        totalRequests: requestsCount,
        pendingRequests: pendingCount,
        completedRequests: completedCount
      },
      recentActivity
    });
  } else if (req.user.role === 'technician') {
    // Technician Specific Stats
    const assignedCount = await RepairRequest.countDocuments({ assignedToId: userId, isDeleted: false });
    const pendingCount = await RepairRequest.countDocuments({ assignedToId: userId, status: 'Pending', isDeleted: false });
    const inProgressCount = await RepairRequest.countDocuments({ assignedToId: userId, status: 'In Progress', isDeleted: false });
    const completedCount = await RepairRequest.countDocuments({ assignedToId: userId, status: 'Completed', isDeleted: false });

    const recentActivity = await RepairRequest.find({ assignedToId: userId, isDeleted: false })
      .sort({ updatedAt: -1 })
      .limit(5);

    return res.json({
      stats: {
        assigned: assignedCount,
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount
      },
      recentActivity
    });
  } else {
    // Admin Stats (Simplified for now)
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalDevices = await Device.countDocuments({ isDeleted: false });
    const activeRepairs = await RepairRequest.countDocuments({ status: 'In Progress', isDeleted: false });
    
    return res.json({ stats: { totalUsers, totalDevices, activeRepairs } });
  }
});

module.exports = { getDashboardStats };