const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config/config");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

// Trust proxy - Required for Vercel and other reverse proxies
// This allows Express to trust X-Forwarded-* headers
app.set("trust proxy", 1);

// Security Middleware
app.use(helmet());

// CORS Configuration - Allow multiple origins including Vercel preview deployments
const allowedOrigins = [
  config.corsOrigin, // Main origin from env
  "http://localhost:5173", // Local development
  "http://localhost:3000",
];

// Also allow any Vercel deployment URL (preview deployments)
const isVercelDeployment = (origin) => {
  return (
    origin &&
    origin.includes("v0-techtrek-analytics") &&
    origin.includes("vercel.app")
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list or is a Vercel deployment
      if (allowedOrigins.includes(origin) || isVercelDeployment(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

// Request Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Favicon handler - Prevents 404 errors from Vercel's favicon checks
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/favicon.png", (req, res) => res.status(204).end());

// API Routes
app.use("/api/trending", require("./routes/trendingRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/ingest", require("./routes/ingestRoutes"));
app.use("/api/health", require("./routes/healthRoutes"));

// Welcome Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🎯 Welcome to TechPulse Analytics API",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      trending: "/api/trending",
      analytics: "/api/analytics",
      search: "/api/search",
      ingest: "/api/ingest",
      health: "/api/health",
    },
  });
});

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
