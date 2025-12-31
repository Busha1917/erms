const express = require('express');
const router = express.Router();
const { getInventory, addPart, updatePart, deletePart } = require('./inventoryController');
const { protect, authorize } = require('./authMiddleware');

// @route   GET /api/inventory
// @desc    Get all spare parts
// @access  Private (Admin/Technician)
router.get('/', protect, getInventory);

// @route   POST /api/inventory
// @desc    Add new spare part
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), addPart);

// @route   GET /api/inventory/:id
// @desc    Get single part details
// @access  Private (Admin/Technician)
// router.get('/:id', protect, getPartById); // Not implemented yet

// @route   PUT /api/inventory/:id
// @desc    Update part details (e.g., restock, price change)
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), updatePart);

// @route   DELETE /api/inventory/:id
// @desc    Remove part from inventory
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deletePart);

module.exports = router;