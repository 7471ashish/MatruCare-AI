const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const { generateOtp, hashOtp, verifyOtpHash } = require('../utils/otpGenerator');
const { sendOtpEmail } = require('../utils/emailService');

// Token generation helper
const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Cookie options helper for HttpOnly JWT session
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  path: '/',
});

/**
 * POST /api/auth/signup
 * Create unverified user, hash password with bcrypt 12 rounds, generate OTP, email it
 */
const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail }).select(
      '+password +otpHash +otpExpiresAt +otpAttempts'
    );

    if (user && user.isVerified) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
        data: null,
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user && !user.isVerified) {
      // Update unverified user with new details & fresh OTP
      user.fullName = fullName.trim();
      user.password = password; // Will be hashed via pre-save with bcrypt 12
      user.otpHash = otpHash;
      user.otpExpiresAt = otpExpiresAt;
      user.otpAttempts = 0;
      user.otpLastSentAt = new Date();
      await user.save();
    } else {
      // Create new unverified user
      user = new User({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password, // Will be hashed via pre-save hook with bcrypt 12
        isVerified: false,
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
      });
      await user.save();
    }

    // Dispatch verification OTP via email
    const emailResult = await sendOtpEmail(normalizedEmail, user.fullName, otp);

    if (!emailResult.success) {
      // Reset cooldown so user is not blocked on send failure
      user.otpLastSentAt = null;
      await user.save();

      return res.status(502).json({
        success: false,
        message: "We couldn't send the verification email. Please try again.",
        data: null,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Verification code sent to your email. Please verify to activate your account.',
      data: {
        email: user.email,
        expiresInMinutes: 10,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 * Verify OTP (10-min expiry, invalidated after first use or 5 failed attempts), set isVerified=true
 * Strictly redirects to Login — does NOT return JWT token.
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+otpHash +otpExpiresAt +otpAttempts'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
        data: null,
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Account is already verified. Please proceed to log in.',
        data: {
          email: user.email,
          isVerified: true,
        },
      });
    }

    // Check expiry or missing OTP
    if (!user.otpExpiresAt || !user.otpHash || new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.',
        data: null,
      });
    }

    // Brute-force protection: check if attempts already exceeded limit
    if (user.otpAttempts >= 5) {
      await User.updateOne(
        { _id: user._id },
        { $set: { otpHash: null, otpExpiresAt: null, otpAttempts: 0 } }
      );

      return res.status(400).json({
        success: false,
        message:
          'Too many incorrect attempts. Your verification code has been invalidated. Please request a new code.',
        data: { attemptsExceeded: true },
      });
    }

    // Constant-time HMAC verification
    const isValid = verifyOtpHash(otp, user.otpHash);
    if (!isValid) {
      // Atomic increment to prevent race conditions
      const updated = await User.findOneAndUpdate(
        { _id: user._id },
        { $inc: { otpAttempts: 1 } },
        { new: true }
      ).select('+otpAttempts');

      if (updated.otpAttempts >= 5) {
        await User.updateOne(
          { _id: user._id },
          { $set: { otpHash: null, otpExpiresAt: null, otpAttempts: 0 } }
        );

        return res.status(400).json({
          success: false,
          message:
            'Too many incorrect attempts. Your verification code has been invalidated. Please request a new code.',
          data: { attemptsExceeded: true },
        });
      }

      const remaining = 5 - updated.otpAttempts;
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${remaining} attempt(s) remaining.`,
        data: { attemptsRemaining: remaining },
      });
    }

    // Valid OTP: Atomically activate user, invalidate OTP, and reset attempts
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          isVerified: true,
          otpHash: null,
          otpExpiresAt: null,
          otpAttempts: 0,
        },
      }
    );

    // Strictly returns verification status only — JWT is issued upon login only
    return res.status(200).json({
      success: true,
      message: 'Account verified successfully! Please log in to continue.',
      data: {
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-otp
 * New OTP, invalidate old, email it (45s cooldown)
 */
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+otpHash +otpExpiresAt +otpLastSentAt +otpAttempts'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
        data: null,
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Account is already verified. Please log in.',
        data: {
          email: user.email,
          isVerified: true,
        },
      });
    }

    // Check resend cooldown (45 seconds)
    const cooldownMs = 45 * 1000;
    if (user.otpLastSentAt && Date.now() - new Date(user.otpLastSentAt).getTime() < cooldownMs) {
      const remainingSeconds = Math.ceil(
        (cooldownMs - (Date.now() - new Date(user.otpLastSentAt).getTime())) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingSeconds} seconds before requesting a new verification code.`,
        data: { retryAfterSeconds: remainingSeconds },
      });
    }

    // Generate new OTP and reset attempts
    const otp = generateOtp();
    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date();
    await user.save();

    // Send new email
    const emailResult = await sendOtpEmail(normalizedEmail, user.fullName, otp);
    if (!emailResult.success) {
      // Reset cooldown so user isn't locked out due to send failure
      user.otpLastSentAt = null;
      await user.save();

      return res.status(502).json({
        success: false,
        message: "We couldn't send the verification email. Please try again.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'A fresh 6-digit verification code has been dispatched to your email.',
      data: {
        email: normalizedEmail,
        expiresInMinutes: 10,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Verify password FIRST, THEN check isVerified.
 * Issues HttpOnly cookie and JWT token.
 * Account-based failed-login throttling (locks after 5 failures).
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Query user and explicitly select password & failed login counters
    const user = await User.findOne({ email: normalizedEmail }).select(
      '+password +failedLoginAttempts +lockUntil'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        data: null,
      });
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000));
      return res.status(429).json({
        success: false,
        message: `Account is temporarily locked due to excessive failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
        data: { lockUntil: user.lockUntil },
      });
    }

    // 1. Verify password FIRST
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      let lockUntil = null;

      if (attempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lock
      }

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            failedLoginAttempts: attempts >= 5 ? 0 : attempts,
            lockUntil,
          },
        }
      );

      if (lockUntil) {
        return res.status(429).json({
          success: false,
          message:
            'Account is temporarily locked due to 5 consecutive failed login attempts. Please try again in 15 minutes.',
          data: null,
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        data: null,
      });
    }

    // Reset failed login counters on successful password authentication
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      await User.updateOne(
        { _id: user._id },
        { $set: { failedLoginAttempts: 0, lockUntil: null } }
      );
    }

    // 2. THEN check isVerified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not verified yet. Please verify your OTP to continue.',
        data: {
          isUnverified: true,
          email: user.email,
        },
      });
    }

    // Issue JWT
    const token = generateToken(user._id, user.email);

    // Set secure HttpOnly cookie
    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Clears HttpOnly authentication cookie
 */
const logout = async (req, res) => {
  res.clearCookie('token', getClearCookieOptions());
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
    data: null,
  });
};

module.exports = {
  signup,
  verifyOtp,
  resendOtp,
  login,
  logout,
};
