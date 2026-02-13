const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const cosmosService = require("../services/cosmosService");
const sqlService = require("../services/sqlService");
const logger = require("../utils/logger");

// Get all trending items
exports.getAllTrending = catchAsync(async (req, res) => {
  const {
    limit = 50,
    source,
    timeRange = "week",
    sort = "popularity",
  } = req.query;

  logger.info(
    `Fetching trending items - limit: ${limit}, source: ${source}, timeRange: ${timeRange}, sort: ${sort}`
  );

  const items = await cosmosService.getTrendingItems({
    limit: parseInt(limit),
    source,
    timeRange,
    sort,
  });

  res.status(200).json({
    status: "success",
    count: items.length,
    timeRange,
    data: items,
  });
});

// Get trending by specific source
exports.getTrendingBySource = catchAsync(async (req, res) => {
  const { source } = req.params;
  const { limit = 50, timeRange = "week", sort = "popularity" } = req.query;

  const validSources = ["github", "hackernews"];
  if (!validSources.includes(source.toLowerCase())) {
    throw new ApiError(400, "Invalid source. Must be github or hackernews");
  }

  logger.info(
    `Fetching trending items for source: ${source}, timeRange: ${timeRange}`
  );

  const items = await cosmosService.getTrendingItems({
    limit: parseInt(limit),
    source: source.toLowerCase(),
    timeRange,
    sort,
  });

  res.status(200).json({
    status: "success",
    source,
    timeRange,
    count: items.length,
    data: items,
  });
});

// Get trending topics/tags from SQL
exports.getTrendingTopics = catchAsync(async (req, res) => {
  const { source, limit = 20 } = req.query;

  logger.info(
    `Fetching trending topics - source: ${source || "all"}, limit: ${limit}`
  );

  const topics = await sqlService.getTrendingTopics(source, parseInt(limit));

  res.status(200).json({
    status: "success",
    count: topics.length,
    data: topics,
  });
});
