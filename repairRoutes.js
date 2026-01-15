const express = require('express');
const router = express.Router();
const {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest
} = require('../controllers/repairRequestController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getRequests)
  .post(protect, createRequest);

router.route('/:id')
  .get(protect, getRequestById)
  .put(protect, updateRequest);

module.exports = router;