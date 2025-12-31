// DEPRECATED: This file is part of the legacy structure.
// Please refer to src/controllers/authController.js and src/routes/authRoutes.js for the new implementation.

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    if (user.isDeleted) {
      return res.status(401).json({ message: 'This account has been deleted.' });
    }
    if (user.status === 'Suspended') {
      return res.status(401).json({ message: 'This account is suspended.' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const registerUser = async (req, res) => {
  const { name, username, email, password, role, department, phone, address } = req.body;
  
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    role: role || 'user',
    department,
    phone,
    address
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { authUser, registerUser, getMe };