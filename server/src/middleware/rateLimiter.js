const rateLimit = require('express-rate-limit');

/**
 * Standard JSON response handler for rate limit exceedance
 */
const rateLimitHandler = (message) => (req, res) => {
  res.status(429).json({
    success: false,
    message,
    data: null,
  });
};

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many requests from this IP, please try again after 15 minutes.'),
});

// Auth endpoints rate limiter (signup, login)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many authentication attempts. Please try again after 15 minutes.'),
});

// OTP endpoints rate limiter (verify-otp, resend-otp)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many OTP attempts. Please wait a few minutes before trying again.'),
});

// Contact endpoint rate limiter
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many messages sent. Please try again later.'),
});

module.exports = {
  generalLimiter,
  authLimiter,
  otpLimiter,
  contactLimiter,
};

