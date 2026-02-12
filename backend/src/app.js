const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Trust proxy - Required for Vercel and other reverse proxies
// This allows Express to trust X-Forwarded-* headers
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Request Logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/trending', require('./routes/trendingRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/ingest', require('./routes/ingestRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));

// Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🎯 Welcome to TechPulse Analytics API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      trending: '/api/trending',
      analytics: '/api/analytics',
      search: '/api/search',
      ingest: '/api/ingest',
      health: '/api/health'
    }
  });
});

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
