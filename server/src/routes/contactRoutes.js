const express = require('express');
const { submitContactForm } = require('../controllers/contactController');
const { contactValidation } = require('../validators');
const { validate } = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/contact
router.post('/', contactLimiter, contactValidation, validate, submitContactForm);

module.exports = router;

