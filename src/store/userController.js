const User = require('./User');
const bcrypt = require('bcryptjs');
const asyncHandler = require('./asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const { role, status, search, deleted } = req.query;
  const query = {};

  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (deleted !== 'true') {
    query.isDeleted = false;
  }

  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, role, department, phone, address } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({
    name, username, email, password, role, department, phone, address
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.department = req.body.department || user.department;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  user.status = req.body.status || user.status;
  
  if (req.body.password) {
    user.password = req.body.password; // Will be hashed by pre-save
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    status: updatedUser.status
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Soft delete
  user.isDeleted = true;
  user.status = 'Suspended';
  await user.save();
  res.json({ message: 'User removed (soft delete)' });
});

const restoreUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isDeleted = false;
  user.status = 'Active';
  await user.save();
  res.json({ message: 'User restored' });
});

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, restoreUser };