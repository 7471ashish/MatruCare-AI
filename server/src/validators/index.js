const { body } = require('express-validator');

// Options to prevent altering Gmail dots or subaddresses
const normalizeEmailOptions = {
  gmail_remove_dots: false,
  gmail_remove_subaddress: false,
};

// URL validation options requiring valid http or https protocol
const urlOptions = {
  protocols: ['http', 'https'],
  require_protocol: true,
};

// Auth validation rules
const signupValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Full name must contain letters and spaces only'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(normalizeEmailOptions),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 15 })
    .withMessage('Password must be at least 15 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{15,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

const verifyOtpValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(normalizeEmailOptions),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('Verification OTP is required')
    .matches(/^\d{6}$/)
    .withMessage('OTP must be exactly 6 digits'),
];

const resendOtpValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(normalizeEmailOptions),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(normalizeEmailOptions),
  body('password').notEmpty().withMessage('Password is required'),
];

// Profile update validation
const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters long'),
];

// Registration validation
const hackathonRegistrationValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Full name must contain letters and spaces only'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(normalizeEmailOptions),
  body('mobile')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Mobile number must be a valid 10-digit Indian mobile number starting with 6-9'),
  body('collegeName')
    .trim()
    .notEmpty()
    .withMessage('College / Institution name is required'),
  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course is required'),
  body('branch')
    .trim()
    .notEmpty()
    .withMessage('Branch is required'),
  body('yearOfStudy')
    .trim()
    .notEmpty()
    .withMessage('Year of study is required')
    .isIn(['1st', '2nd', '3rd', '4th', 'Final Year'])
    .withMessage('Year of study must be 1st, 2nd, 3rd, 4th, or Final Year'),
  body('domain')
    .trim()
    .notEmpty()
    .withMessage('Hackathon domain track is required'),
  body('projectName')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 5 })
    .withMessage('Project name must be at least 5 characters long'),
  body('pptLink')
    .trim()
    .notEmpty()
    .withMessage('Presentation / Pitch Deck link is required')
    .isURL(urlOptions)
    .withMessage('PPT Link must be a valid HTTP or HTTPS URL (Google Drive / OneDrive)'),
  body('prototypeLink')
    .trim()
    .notEmpty()
    .withMessage('Prototype / Code repository link is required')
    .isURL(urlOptions)
    .withMessage('Prototype Link must be a valid HTTP or HTTPS URL (GitHub / Figma / live demo)'),
  body('demoVideoLink')
    .optional({ checkFalsy: true })
    .trim()
    .isURL(urlOptions)
    .withMessage('Demo Video Link must be a valid HTTP or HTTPS URL (YouTube / Drive)'),
  body('teamSize')
    .notEmpty()
    .withMessage('Team size is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Team size must be between 1 and 5'),
  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array')
    .custom((members, { req }) => {
      const size = parseInt(req.body.teamSize, 10);
      const leadEmail = (req.user?.email || req.body.email || '').toLowerCase().trim();
      const memberList = Array.isArray(members) ? members : [];

      if (size === 1) {
        if (memberList.length > 0) {
          throw new Error('Solo participant (Team Size 1) cannot have additional team members');
        }
        return true;
      }

      if (size >= 2) {
        if (memberList.length !== size) {
          throw new Error(`Team size of ${size} requires exactly ${size} additional team member entries`);
        }

        const emails = new Set();
        for (let i = 0; i < memberList.length; i++) {
          const member = memberList[i];
          if (!member.name || member.name.trim().length < 2) {
            throw new Error(`Team member #${i + 1} must have a valid name (at least 2 characters)`);
          }
          if (!/^[A-Za-z\s]+$/.test(member.name.trim())) {
            throw new Error(`Team member #${i + 1} name must contain letters and spaces only`);
          }
          if (!member.email || !/^\S+@\S+\.\S+$/.test(member.email.trim())) {
            throw new Error(`Invalid email address provided for member #${i + 1}`);
          }
          const lower = member.email.trim().toLowerCase();
          if (leadEmail && lower === leadEmail) {
            throw new Error(`Team member #${i + 1} email cannot be the same as the team leader email`);
          }
          if (emails.has(lower)) {
            throw new Error(`Duplicate team member email detected: ${lower}`);
          }
          emails.add(lower);
        }
      }
      return true;
    }),
];

// Contact validation
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(normalizeEmailOptions),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long'),
];

module.exports = {
  signupValidation,
  verifyOtpValidation,
  resendOtpValidation,
  loginValidation,
  updateProfileValidation,
  hackathonRegistrationValidation,
  contactValidation,
};
