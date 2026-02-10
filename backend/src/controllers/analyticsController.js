const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const sqlService = require('../services/sqlService');
const logger = require('../utils/logger');

// Get overall analytics
exports.getOverallAnalytics = catchAsync(async (req, res) => {
  const { range = 'month' } = req.query;
  
  logger.info(`Fetching overall analytics - range: ${range}`);
  
  const analytics = await sqlService.getOverallAnalytics(range);
  
  res.status(200).json({
    status: 'success',
    range,
    data: analytics
  });
});

// Get daily metrics
exports.getDailyMetrics = catchAsync(async (req, res) => {
  const { range = 'week', source } = req.query;
  
  logger.info(`Fetching daily metrics - range: ${range}, source: ${source}`);
  
  const metrics = await sqlService.getDailyMetrics(range, source);
  
  res.status(200).json({
    status: 'success',
    range,
    data: metrics
  });
});

// Get source-specific analytics
exports.getSourceAnalytics = catchAsync(async (req, res) => {
  const { source } = req.params;
  const { range = 'month' } = req.query;
  
  const validSources = ['github', 'hackernews'];
  if (!validSources.includes(source.toLowerCase())) {
    throw new ApiError(400, 'Invalid source. Must be github or hackernews');
  }
  
  logger.info(`Fetching analytics for source: ${source}`);
  
  const analytics = await sqlService.getSourceAnalytics(source.toLowerCase(), range);
  
  res.status(200).json({
    status: 'success',
    source,
    range,
    data: analytics
  });
});
