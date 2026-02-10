const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const searchService = require('../services/searchService');
const logger = require('../utils/logger');

// Search for content
exports.search = catchAsync(async (req, res) => {
  const { q, source, date, language, limit = 20, offset = 0 } = req.query;
  
  if (!q || q.trim().length === 0) {
    throw new ApiError(400, 'Search query is required');
  }
  
  logger.info(`Search query: ${q}, source: ${source}, language: ${language}`);
  
  const results = await searchService.search({
    query: q,
    source,
    date,
    language,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
  
  res.status(200).json({
    status: 'success',
    query: q,
    count: results.count,
    data: results.items
  });
});

// Get autocomplete suggestions
exports.suggest = catchAsync(async (req, res) => {
  const { q, limit = 5 } = req.query;
  
  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Query must be at least 2 characters');
  }
  
  logger.info(`Autocomplete query: ${q}`);
  
  const suggestions = await searchService.getSuggestions(q, parseInt(limit));
  
  res.status(200).json({
    status: 'success',
    query: q,
    suggestions
  });
});
