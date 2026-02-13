const rateLimit = require("express-rate-limit");
const config = require("../config/config");

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use req.ip which already handles proxy headers when trust proxy is enabled
  // This automatically normalizes IPv6 addresses correctly
  skip: (req) => false, // Don't skip any requests
});

module.exports = limiter;
