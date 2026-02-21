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
  // Skip rate limiting for localhost in development
  skip: (req) => {
    if (config.nodeEnv === "development") {
      const ip = req.ip;
      // Skip for localhost, 127.0.0.1, and ::1 (IPv6 localhost)
      return (
        ip === "::1" ||
        ip === "127.0.0.1" ||
        ip === "localhost" ||
        ip.includes("127.0.0.1") ||
        ip.includes("::ffff:127.0.0.1")
      );
    }
    return false;
  },
});

module.exports = limiter;
