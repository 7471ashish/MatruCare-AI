const { validationResult } = require('express-validator');

/**
 * Middleware to check validation results from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: formattedErrors[0].message, // Top error as friendly message
      errors: formattedErrors,
      data: null,
    });
  }
  next();
};

module.exports = {
  validate,
};

