const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to properly handle proxy headers
  // This will use the real client IP from X-Forwarded-For when behind a proxy
  keyGenerator: (req) => {
    // When behind a proxy (Vercel), get the real IP from X-Forwarded-For
    // req.ip already handles this correctly when trust proxy is enabled
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

module.exports = limiter;
