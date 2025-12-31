const RepairRequest = require('./RepairRequest');

const getReports = async (req, res) => {
  const repairsByStatus = await RepairRequest.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const repairsByTechnician = await RepairRequest.aggregate([
    { $match: { isDeleted: false, assignedToId: { $ne: null } } },
    { $group: { _id: "$assignedToId", count: { $sum: 1 } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "technician" } },
    { $unwind: "$technician" },
    { $project: { name: "$technician.name", count: 1 } }
  ]);

  res.json({
    repairsByStatus,
    repairsByTechnician
  });
};

module.exports = { getReports };