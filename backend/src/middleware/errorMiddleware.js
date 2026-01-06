const AppError = require('../utils/AppError');

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development: show full error
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack
    });
  }

  // Production: hide internal details
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Unknown error
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};

module.exports = globalErrorHandler;
