const crypto = require('crypto');
const config = require('../config/env');

/**
 * Generate a cryptographically secure 6-digit OTP string
 * Range: 100000 to 999999
 * @returns {string} 6-digit OTP
 */
const generateOtp = () => {
  const otpNumber = crypto.randomInt(100000, 1000000);
  return otpNumber.toString();
};

/**
 * Hash an OTP string using HMAC-SHA256 with server-side secret
 * @param {string} otp
 * @returns {string} Hex-encoded HMAC-SHA256 digest
 */
const hashOtp = (otp) => {
  const secret = config.otpSecret || config.jwtSecret;
  return crypto.createHmac('sha256', secret).update(String(otp).trim()).digest('hex');
};

/**
 * Verify whether a candidate OTP matches the stored HMAC
 * Uses crypto.timingSafeEqual to prevent timing side-channel attacks
 * @param {string} candidateOtp
 * @param {string} storedHmac
 * @returns {boolean}
 */
const verifyOtpHash = (candidateOtp, storedHmac) => {
  if (!candidateOtp || !storedHmac) return false;
  const candidateHmac = hashOtp(candidateOtp);
  const bufA = Buffer.from(candidateHmac, 'hex');
  const bufB = Buffer.from(storedHmac, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

module.exports = {
  generateOtp,
  hashOtp,
  verifyOtpHash,
};
