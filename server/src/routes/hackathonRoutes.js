const express = require('express');
const {
  registerForHackathon,
  getMyEntry,
  deleteEntry,
  updateEntry,
} = require('../controllers/hackathonController');
const { requireAuth } = require('../middleware/auth');
const { hackathonRegistrationValidation } = require('../validators');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All hackathon endpoints are protected by JWT authentication
router.post('/register', requireAuth, hackathonRegistrationValidation, validate, registerForHackathon);
router.get('/my-entry', requireAuth, getMyEntry);
router.put('/:id', requireAuth, updateEntry);
router.delete('/:id', requireAuth, deleteEntry);

module.exports = router;

