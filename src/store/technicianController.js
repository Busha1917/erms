const User = require('./User');

const getTechnicians = async (req, res) => {
  const technicians = await User.find({ role: 'technician', isDeleted: false }).select('-password');
  res.json(technicians);
};

const getTechnicianProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user || user.role !== 'technician') {
    return res.status(404).json({ message: 'Technician not found' });
  }
  res.json(user);
};

module.exports = { getTechnicians, getTechnicianProfile };