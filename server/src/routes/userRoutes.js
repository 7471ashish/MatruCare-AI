const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { updateProfileValidation } = require('../validators');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Protected profile routes
router.get('/me', requireAuth, getProfile);
router.put('/update', requireAuth, updateProfileValidation, validate, updateProfile);

module.exports = router;

