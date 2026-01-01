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
  
  if (deleted === 'true') {
    query.isDeleted = true;
  } else {
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
  let { name, username, email, password, role, department, phone, address } = req.body;

  console.log(`[CreateUser] Request Body:`, JSON.stringify(req.body, null, 2));

  // Validate required fields
  if (!name || !email || !password) {
    console.error('[CreateUser] Missing required fields');
    res.status(400);
    throw new Error('Please include all required fields: name, email, password');
  }

  // Normalize inputs to ensure consistency
  email = email.trim().toLowerCase();
  if (username) username = username.trim().toLowerCase();
  
  // Handle role validation
  if (role && role.trim() !== '') {
    role = role.trim().toLowerCase();
    if (!['admin', 'technician', 'user'].includes(role)) {
      console.error(`[CreateUser] Invalid role: ${role}`);
      res.status(400);
      throw new Error('Invalid role. Allowed values: admin, technician, user');
    }
  } else {
    role = 'user';
  }

  // Check if email exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    console.error(`[CreateUser] Email collision: ${email}`);
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Handle Username
  let finalUsername = username;
  if (!finalUsername) {
    finalUsername = email.split('@')[0];
  }
  finalUsername = finalUsername.toLowerCase();

  // Check username collision and ensure uniqueness
  let isUnique = false;
  while (!isUnique) {
    const usernameExists = await User.findOne({ username: finalUsername });
    if (usernameExists) {
      if (username) {
          // If explicitly provided, fail
          console.error(`[CreateUser] Username collision (explicit): ${finalUsername}`);
          res.status(400);
          throw new Error(`Username '${finalUsername}' is already taken. Please choose another.`);
      } else {
          // If auto-generated, append random suffix to make it unique
          finalUsername = `${email.split('@')[0]}${Math.floor(1000 + Math.random() * 9000)}`.toLowerCase();
          console.log(`[CreateUser] Username collision handled. Generated: ${finalUsername}`);
      }
    } else {
      isUnique = true;
    }
  }

  const user = await User.create({
    name, 
    username: finalUsername, 
    email, 
    password, 
    role, 
    department, 
    phone, 
    address
  });

  if (user) {
    console.log(`[CreateUser] User created successfully: ${user._id}`);
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  
  if (req.body.role) {
    const newRole = req.body.role.toLowerCase();
    if (['admin', 'technician', 'user'].includes(newRole)) {
      user.role = newRole;
    }
  }
  
  user.department = req.body.department || user.department;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  user.status = req.body.status || user.status;
  
  if (req.body.password) {
    user.password = req.body.password; // Will be hashed by pre-save
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
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