const express = require('express');
const router = express.Router();
const { getInventory, addPart, updatePart, deletePart } = require('./inventoryController');
const { protect, authorize } = require('./authMiddleware');

router.route('/')
  .get(protect, getInventory)
  .post(protect, authorize('admin'), addPart);

router.route('/:id')
  .put(protect, authorize('admin'), updatePart)
  .delete(protect, authorize('admin'), deletePart);

module.exports = router;