const catchAsync = require('../utils/catchAsync');
const cosmosService = require('../services/cosmosService');
const sqlService = require('../services/sqlService');
const searchService = require('../services/searchService');
const logger = require('../utils/logger');

// Overall health check
exports.checkHealth = catchAsync(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {},
    warnings: []
  };
  
  try {
    // Check Cosmos DB
    const cosmosHealth = await cosmosService.healthCheck();
    health.services.cosmosDB = cosmosHealth ? 'connected' : 'disconnected';
    
    if (!cosmosHealth) {
      health.status = 'degraded';
      health.warnings.push('Cosmos DB is not connected - using mock data in development mode');
    }
  } catch (error) {
    health.services.cosmosDB = 'error';
    health.status = 'degraded';
    health.warnings.push(`Cosmos DB error: ${error.message}`);
  }
  
  try {
    // Check SQL Database
    const sqlHealth = await sqlService.healthCheck();
    health.services.azureSQL = sqlHealth ? 'connected' : 'disconnected';
    
    if (!sqlHealth) {
      health.status = 'degraded';
      health.warnings.push('Azure SQL is not connected');
    }
  } catch (error) {
    health.services.azureSQL = 'error';
    health.status = 'degraded';
    health.warnings.push(`Azure SQL error: ${error.message}`);
  }
  
  try {
    // Check Search Service
    const searchHealth = await searchService.healthCheck();
    health.services.cognitiveSearch = searchHealth ? 'connected' : 'disconnected';
    
    if (!searchHealth) {
      health.status = 'degraded';
      health.warnings.push('Cognitive Search is not connected');
    }
  } catch (error) {
    health.services.cognitiveSearch = 'error';
    health.status = 'degraded';
    health.warnings.push(`Cognitive Search error: ${error.message}`);
  }
  
  // Clean up warnings if empty
  if (health.warnings.length === 0) {
    delete health.warnings;
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json({
    status: 'success',
    data: health
  });
});

// Check Cosmos DB health
exports.checkCosmosDB = catchAsync(async (req, res) => {
  const isHealthy = await cosmosService.healthCheck();
  
  res.status(isHealthy ? 200 : 503).json({
    status: 'success',
    service: 'Cosmos DB',
    healthy: isHealthy,
    timestamp: new Date().toISOString()
  });
});

// Check SQL Database health
exports.checkSQL = catchAsync(async (req, res) => {
  const isHealthy = await sqlService.healthCheck();
  
  res.status(isHealthy ? 200 : 503).json({
    status: 'success',
    service: 'Azure SQL',
    healthy: isHealthy,
    timestamp: new Date().toISOString()
  });
});

// Check Search Service health
exports.checkSearch = catchAsync(async (req, res) => {
  const isHealthy = await searchService.healthCheck();
  
  res.status(isHealthy ? 200 : 503).json({
    status: 'success',
    service: 'Cognitive Search',
    healthy: isHealthy,
    timestamp: new Date().toISOString()
  });
});
