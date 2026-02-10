const winston = require("winston");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");

// Create transports array
const transports = [];

// Only use file logging in local development
if (config.nodeEnv === "development") {
  try {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    transports.push(
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new winston.transports.File({ filename: "logs/combined.log" })
    );
  } catch (error) {
    console.warn(
      "Could not create log files, using console only:",
      error.message
    );
  }
}

// Always add console transport
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "techpulse-analytics" },
  transports,
});

module.exports = logger;
