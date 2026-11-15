const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

// Validate required environment variables in production
if (nodeEnv === 'production') {
  const required = [
    'MONGO_URI',
    'JWT_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'CLIENT_URL',
  ];
  const missing = required.filter((key) => !process.env[key] || process.env[key].trim() === '');
  if (missing.length > 0) {
    throw new Error(
      `[Config Error] Missing required environment variables for production: ${missing.join(', ')}`
    );
  }
}

// JWT_SECRET must have no fallback and must be at least 32 characters
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error(
    '[Config Error] JWT_SECRET environment variable is required and must be at least 32 characters long. Set a secure secret in your .env file.'
  );
}

// In development, loud warning if EMAIL_PASS is missing
const emailPass = process.env.EMAIL_PASS || '';
if (nodeEnv !== 'production' && (!emailPass || emailPass.includes('your_gmail'))) {
  console.warn(
    '\n====================================================================\n' +
    ' [WARNING] Live Gmail SMTP password (EMAIL_PASS) is not configured.\n' +
    ' Using JSON test transport: emails will be logged locally to console.\n' +
    ' To enable real delivery to matrucareai@gmail.com, configure a valid\n' +
    ' 16-character Gmail App Password in server/.env.\n' +
    '====================================================================\n'
  );
}

const fromName = process.env.EMAIL_FROM_NAME || 'MatruCare AI';
const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'matrucareai@gmail.com';
const otpSecret = process.env.OTP_SECRET || jwtSecret;

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || (nodeEnv === 'test' ? 'mongodb://127.0.0.1:27017/matrucare_hackathon_test' : 'mongodb://127.0.0.1:27017/matrucare_hackathon'),
  jwtSecret,
  otpSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER || 'matrucareai@gmail.com',
    pass: emailPass,
    fromName,
    fromAddress,
    from: `"${fromName}" <${fromAddress}>`,
    contactReceiver: process.env.CONTACT_RECEIVER_EMAIL || 'matrucareai@gmail.com',
  },
};

module.exports = config;
