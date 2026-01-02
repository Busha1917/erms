const express = require('express');
const router = express.Router();
const { getRequests, createRequest, updateRequest } = require('./repairRequestController');
const { protect } = require('./authMiddleware');

router.route('/')
  .get(protect, getRequests)
  .post(protect, createRequest);

router.route('/:id').put(protect, updateRequest);

module.exports = router;