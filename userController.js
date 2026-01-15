const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/users
// @access  Public/Admin
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, role, department, phone, address } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Please add all required fields' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user in database
    const user = await User.create({
      name, username, email, password, role, department, phone, address
    });

    if (user) {
      console.log(`[PERSISTENCE] User saved to MongoDB: ${user.email} (${user._id})`);
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({ isDeleted: false });
  console.log(`Fetched ${users.length} users from DB`);
  res.status(200).json(users);
};

module.exports = { registerUser, getUsers };