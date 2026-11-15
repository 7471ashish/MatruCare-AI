const nodemailer = require('nodemailer');
const config = require('../config/env');
const {
  getOtpEmailTemplate,
  getRegistrationEmailTemplate,
  getContactEmailTemplate,
} = require('./emailTemplates');

let transporter = null;
let isLiveSmtpConfigured = false;

/**
 * Initialize nodemailer transporter.
 * Uses configured SMTP (host, port, auth) or Gmail service;
 * falls back to json test transport in development if password is not configured.
 */
const initTransporter = () => {
  const { user, pass, host, port } = config.email;

  // Check if real password credentials are provided (placeholder check)
  const isPlaceholder = !pass || pass.includes('your_gmail') || pass.trim() === '';

  // In test environment, always use json transport to prevent network delays and spamming real SMTP
  if (!isPlaceholder && user && config.nodeEnv !== 'test') {
    try {
      if (host && host !== 'smtp.gmail.com') {
        transporter = nodemailer.createTransport({
          host,
          port: port || 587,
          secure: port === 465,
          auth: { user, pass },
        });
      } else {
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass },
        });
      }
      isLiveSmtpConfigured = true;
      console.log(`[Email Service] Configured live SMTP transport with user: ${user}`);
    } catch (err) {
      console.error(`[Email Service] Failed to initialize SMTP: ${err.message}`);
      transporter = null;
    }
  }

  // Fallback to json transport for local testing / development when credentials are placeholder
  if (!transporter) {
    isLiveSmtpConfigured = false;
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
    console.log('[Email Service] Using test transport (local logging enabled)');
  }

  return transporter;
};

// Initial transporter setup
initTransporter();

/**
 * Verify transporter connection
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const verifySmtpConnection = async () => {
  if (!isLiveSmtpConfigured || !transporter) {
    return {
      success: false,
      isLive: false,
      message:
        'Live SMTP credentials not set or using placeholder in .env. Test transport active.',
    };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      isLive: true,
      message: 'SMTP connection verified successfully.',
    };
  } catch (err) {
    console.error(`[Email Service] SMTP verification failed: ${err.message}`);
    return {
      success: false,
      isLive: false,
      message: `SMTP verification failed: ${err.message}`,
    };
  }
};

/**
 * Send email helper with automatic retry mechanism
 * @param {Function} sendFn - Async function performing sendMail
 * @param {number} maxRetries - Maximum retry attempts (default: 2)
 * @param {number} delayMs - Delay between attempts (default: 400ms)
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string, isLive?: boolean }>}
 */
const sendWithRetry = async (sendFn, maxRetries = 2, delayMs = 400) => {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await sendFn();
      if (res && res.success) {
        return res;
      }
      lastError = new Error(res?.error || 'Send attempt returned unsuccessful');
    } catch (err) {
      lastError = err;
    }
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  return {
    success: false,
    error: lastError?.message || 'Email delivery failed after retries',
    isLive: isLiveSmtpConfigured,
  };
};

/**
 * Send an OTP verification email
 * @param {string} toEmail - Recipient email
 * @param {string} fullName - Recipient full name
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
const sendOtpEmail = async (toEmail, fullName, otp) => {
  const { html, text } = getOtpEmailTemplate(fullName, otp);
  const mailOptions = {
    from: config.email.from,
    to: toEmail,
    subject: 'Your MatruCare AI Verification Code',
    text,
    html,
  };

  return sendWithRetry(async () => {
    try {
      const info = await transporter.sendMail(mailOptions);
      if (info && info.message) {
        console.log(`[Email Preview - OTP to ${toEmail}]: Code = ${otp}`);
      }
      return {
        success: true,
        messageId: info.messageId || 'test-mock-id',
        isLive: isLiveSmtpConfigured,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
};

/**
 * Send Hackathon Registration Confirmation Email
 * @param {string} toEmail - Recipient email
 * @param {object} reg - Registration document or payload
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
const sendRegistrationEmail = async (toEmail, reg) => {
  const { html, text } = getRegistrationEmailTemplate(reg);
  const mailOptions = {
    from: config.email.from,
    to: toEmail,
    subject: `Registration Confirmed: MatruCare AI Hackathon 2026 - ${reg.projectName}`,
    text,
    html,
  };

  return sendWithRetry(async () => {
    try {
      const info = await transporter.sendMail(mailOptions);
      if (info && info.message) {
        console.log(`[Email Preview - Registration to ${toEmail}]: Confirmed for ${reg.projectName}`);
      }
      return {
        success: true,
        messageId: info.messageId || 'test-mock-id',
        isLive: isLiveSmtpConfigured,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
};

/**
 * Send Contact form submission email to contactReceiver
 * @param {object} contact - { name, email, message }
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
const sendContactEmail = async (contact) => {
  const { html, text } = getContactEmailTemplate(contact);
  const mailOptions = {
    from: config.email.from,
    to: config.email.contactReceiver || 'matrucareai@gmail.com',
    replyTo: contact.email,
    subject: `[MatruCare AI] Inquiry from ${contact.name}: ${contact.category || 'General'}`,
    text,
    html,
  };

  return sendWithRetry(async () => {
    try {
      const info = await transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId || 'test-mock-id',
        isLive: isLiveSmtpConfigured,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
};

module.exports = {
  sendOtpEmail,
  sendRegistrationEmail,
  sendContactEmail,
  verifySmtpConnection,
  initTransporter,
};
