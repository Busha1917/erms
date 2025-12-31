const express = require('express');
const router = express.Router();
const { getInventory, addPart, updatePart, deletePart } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getInventory)
  .post(protect, authorize('admin', 'technician'), addPart);
router.route('/:id')
  .put(protect, authorize('admin', 'technician'), updatePart)
  .delete(protect, authorize('admin'), deletePart);

module.exports = router;