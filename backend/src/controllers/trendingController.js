const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const cosmosService = require('../services/cosmosService');
const logger = require('../utils/logger');

// Get all trending items
exports.getAllTrending = catchAsync(async (req, res) => {
  const { limit = 50, source, date, sort = 'popularity' } = req.query;
  
  logger.info(`Fetching trending items - limit: ${limit}, source: ${source}, sort: ${sort}`);
  
  const items = await cosmosService.getTrendingItems({
    limit: parseInt(limit),
    source,
    date,
    sort
  });
  
  res.status(200).json({
    status: 'success',
    count: items.length,
    data: items
  });
});

// Get trending by specific source
exports.getTrendingBySource = catchAsync(async (req, res) => {
  const { source } = req.params;
  const { limit = 50, date, sort = 'popularity' } = req.query;
  
  const validSources = ['github', 'hackernews'];
  if (!validSources.includes(source.toLowerCase())) {
    throw new ApiError(400, 'Invalid source. Must be github or hackernews');
  }
  
  logger.info(`Fetching trending items for source: ${source}`);
  
  const items = await cosmosService.getTrendingItems({
    limit: parseInt(limit),
    source: source.toLowerCase(),
    date,
    sort
  });
  
  res.status(200).json({
    status: 'success',
    source,
    count: items.length,
    data: items
  });
});
