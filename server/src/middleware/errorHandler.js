const config = require('../config/env');

/**
 * Centralized error handling middleware
 * Formats every error consistently as { success: false, message, data: null }
 * Stack traces are never leaked unless NODE_ENV === 'development'.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    if (field === 'user') {
      message = 'You have already submitted a registration for this hackathon.';
    } else if (field === 'email') {
      message = 'An account with this email address already exists.';
    } else {
      message = `Duplicate value entered for ${field || 'field'}.`;
    }
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages[0] || 'Validation error';
  }

  // Handle JWT Malformed / Signature Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  const isDev = process.env.NODE_ENV === 'development' || config.nodeEnv === 'development';

  const responsePayload = {
    success: false,
    message,
    data: null,
  };

  if (isDev && err.stack) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

/**
 * 404 Route Not Found middleware
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
    data: null,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
