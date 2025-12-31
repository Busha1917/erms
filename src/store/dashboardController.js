const User = require('./User');
const Device = require('./Device');
const RepairRequest = require('./RepairRequest');
const SparePart = require('./SparePart');

const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalTechnicians = await User.countDocuments({ role: 'technician', isDeleted: false });
  const totalDevices = await Device.countDocuments({ isDeleted: false });
  const totalRepairs = await RepairRequest.countDocuments({ isDeleted: false });
  
  const pendingRepairs = await RepairRequest.countDocuments({ status: 'Pending', isDeleted: false });
  const inProgressRepairs = await RepairRequest.countDocuments({ status: 'In Progress', isDeleted: false });
  const completedRepairs = await RepairRequest.countDocuments({ status: 'Completed', isDeleted: false });

  const lowStockParts = await SparePart.find({ $expr: { $lt: ["$quantity", "$minStockLevel"] } });

  const recentRepairs = await RepairRequest.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('requestedById', 'name')
    .populate('assignedToId', 'name');

  res.json({
    counts: {
      users: totalUsers,
      technicians: totalTechnicians,
      devices: totalDevices,
      repairs: totalRepairs,
      pending: pendingRepairs,
      inProgress: inProgressRepairs,
      completed: completedRepairs
    },
    lowStock: lowStockParts,
    recentActivity: recentRepairs
  });
};

module.exports = { getDashboardStats };