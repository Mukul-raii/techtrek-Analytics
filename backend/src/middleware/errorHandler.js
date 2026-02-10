const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!statusCode) {
    statusCode = 500;
  }
  
  if (config.nodeEnv === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal server error';
  }
  
  res.locals.errorMessage = err.message;
  
  const response = {
    status: 'error',
    statusCode,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  };
  
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
