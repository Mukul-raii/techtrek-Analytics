const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');
const cosmosService = require('./services/cosmosService');
const sqlService = require('./services/sqlService');
const searchService = require('./services/searchService');

const PORT = config.port || 5000;

async function startServer() {
  try {
    // Initialize services
    logger.info('Initializing services...');
    
    await cosmosService.initialize();
    await sqlService.initialize();
    await searchService.initialize();
    
    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 TechPulse Analytics Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
      logger.info(`🌐 CORS enabled for: ${config.corsOrigin}`);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

const server = startServer();

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  if (server) {
    server.then(s => s.close(() => process.exit(1)));
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  if (server) {
    server.then(s => s.close(() => {
      logger.info('💥 Process terminated!');
    }));
  }
});

module.exports = server;
