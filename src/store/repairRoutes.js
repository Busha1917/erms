const express = require('express');
const router = express.Router();
const { getRequests, createRequest, getRequestById, updateRequest } = require('./repairRequestController');
const { protect, authorize } = require('./authMiddleware');

// @route   GET /api/repairs
// @desc    Get all repair requests
// @access  Private (Scope depends on Role)
router.get('/', protect, getRequests);

// @route   POST /api/repairs
// @desc    Create a new repair request
// @access  Private (User/Admin)
router.post('/', protect, createRequest);

// @route   GET /api/repairs/:id
// @desc    Get single repair details
// @access  Private (Owner/Technician/Admin)
router.get('/:id', protect, getRequestById);

// @route   PUT /api/repairs/:id
// @desc    Update repair details (General info)
// @access  Private (Admin/Owner - restricted fields)
router.put('/:id', protect, updateRequest);

// @route   PATCH /api/repairs/:id/status
// @desc    Update repair status
// @access  Private (Technician/Admin)
router.patch('/:id/status', protect, authorize('technician', 'admin'), (req, res) => {
  // TODO: Update status and create log entry
  res.status(200).json({ message: `Status updated for ${req.params.id}` });
});

// @route   PATCH /api/repairs/:id/assign
// @desc    Assign technician to repair
// @access  Private (Admin)
router.patch('/:id/assign', protect, authorize('admin'), (req, res) => {
  // TODO: Assign technician
  res.status(200).json({ message: `Technician assigned to ${req.params.id}` });
});

// @route   POST /api/repairs/:id/logs
// @desc    Add a log note to the repair
// @access  Private (Technician/Admin)
router.post('/:id/logs', protect, authorize('technician', 'admin'), (req, res) => {
  // TODO: Create RepairLog entry
  res.status(201).json({ message: 'Log entry added' });
});

// @route   POST /api/repairs/:id/parts
// @desc    Record part usage for a repair
// @access  Private (Technician/Admin)
router.post('/:id/parts', protect, authorize('technician', 'admin'), (req, res) => {
  // TODO: Deduct stock and link part to repair
  res.status(200).json({ message: 'Part usage recorded' });
});

module.exports = router;