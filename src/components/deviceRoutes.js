const express = require('express');
const router = express.Router();
const { registerDevice, getDevices } = require('../controllers/deviceController');

router.post('/', registerDevice);
router.get('/', getDevices);

module.exports = router;