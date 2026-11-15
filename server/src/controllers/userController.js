const User = require('../models/User');
const HackathonRegistration = require('../models/HackathonRegistration');

/**
 * GET /api/user/me
 * Protected, return authenticated user profile + registration summary
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
        data: null,
      });
    }

    // Check if user has an active registration
    const registration = await HackathonRegistration.findOne({ user: user._id });

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        hasRegistered: Boolean(registration),
        registrationId: registration ? registration._id : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/user/update
 * Protected, update profile fields
 */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        data: null,
      });
    }

    if (fullName && fullName.trim()) {
      user.fullName = fullName.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          isVerified: user.isVerified,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

