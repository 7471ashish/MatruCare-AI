const express = require('express');
const { signup, verifyOtp, resendOtp, login, logout } = require('../controllers/authController');
const {
  signupValidation,
  verifyOtpValidation,
  resendOtpValidation,
  loginValidation,
} = require('../validators');
const { validate } = require('../middleware/validate');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', authLimiter, signupValidation, validate, signup);

// POST /api/auth/verify-otp
router.post('/verify-otp', otpLimiter, verifyOtpValidation, validate, verifyOtp);

// POST /api/auth/resend-otp
router.post('/resend-otp', otpLimiter, resendOtpValidation, validate, resendOtp);

// POST /api/auth/login
router.post('/login', authLimiter, loginValidation, validate, login);

// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;
