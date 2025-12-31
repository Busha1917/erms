const express = require('express');
const router = express.Router();
const { authUser, registerUser, getMe } = require('./authController');
const { protect } = require('./authMiddleware');

router.post('/login', authUser);
router.post('/register', registerUser);
router.get('/me', protect, getMe);

module.exports = router;