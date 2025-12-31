const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('admin'), getUsers);
router.route('/:id')
  .get(protect, getUserById)
  .put(protect, updateUser);

module.exports = router;