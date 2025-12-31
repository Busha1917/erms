const express = require('express');
const router = express.Router();
const { getTechnicians, getTechnicianProfile } = require('./technicianController');
const { protect, authorize } = require('./authMiddleware');

// @route   GET /api/technicians
// @desc    Get all technicians (for assignment dropdowns)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getTechnicians);

// @route   GET /api/technicians/:id
// @desc    Get specific technician profile
// @access  Private (Admin or Self)
router.get('/:id', protect, getTechnicianProfile);

// @route   PUT /api/technicians/profile
// @desc    Update logged-in technician's profile
// @access  Private (Technician)
router.put('/profile', protect, authorize('technician'), (req, res) => {
  // TODO: Update TechnicianProfile
  res.status(200).json({ message: 'Profile updated' });
});

// @route   PATCH /api/technicians/availability
// @desc    Update availability status
// @access  Private (Technician)
router.patch('/availability', protect, authorize('technician'), (req, res) => {
  // TODO: Update availability status
  res.status(200).json({ message: 'Availability updated' });
});

module.exports = router;