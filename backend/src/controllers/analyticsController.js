const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const sqlService = require("../services/sqlService");
const cosmosService = require("../services/cosmosService");
const logger = require("../utils/logger");

// Get overall analytics (using Cosmos DB for real data)
exports.getOverallAnalytics = catchAsync(async (req, res) => {
  const { range = "month" } = req.query;

  logger.info(`Fetching overall analytics - range: ${range}`);

  // Use Cosmos DB for real-time data instead of SQL
  const analytics = await cosmosService.getDetailedAnalytics(range);

  res.status(200).json({
    status: "success",
    range,
    data: analytics,
  });
});

// Get daily metrics
exports.getDailyMetrics = catchAsync(async (req, res) => {
  const { range = "week", source } = req.query;

  logger.info(`Fetching daily metrics - range: ${range}, source: ${source}`);

  const metrics = await sqlService.getDailyMetrics(range, source);

  res.status(200).json({
    status: "success",
    range,
    data: metrics,
  });
});

// Get source-specific analytics (using Cosmos DB for real data)
exports.getSourceAnalytics = catchAsync(async (req, res) => {
  const { source } = req.params;
  const { range = "month" } = req.query;

  const validSources = ["github", "hackernews"];
  if (!validSources.includes(source.toLowerCase())) {
    throw new ApiError(400, "Invalid source. Must be github or hackernews");
  }

  logger.info(`Fetching analytics for source: ${source} from Cosmos DB`);

  // Use Cosmos DB instead of SQL for real-time data
  const analytics = await cosmosService.getSourceAnalytics(
    source.toLowerCase(),
    range
  );

  res.status(200).json({
    status: "success",
    source,
    range,
    data: analytics,
  });
});

// Get language statistics from SQL
exports.getLanguageStats = catchAsync(async (req, res) => {
  const { source = "github" } = req.query;

  logger.info(`Fetching language stats from SQL for source: ${source}`);

  const sourceStats = await sqlService.getSourceAnalytics(source, "month");

  // Parse metadata JSON to get language distribution
  let languageData = [];
  if (sourceStats && sourceStats.metadata) {
    try {
      const metadata = JSON.parse(sourceStats.metadata);
      languageData = metadata.topLanguages || [];
    } catch (error) {
      logger.error("Error parsing language metadata:", error.message);
    }
  }

  res.status(200).json({
    status: "success",
    source,
    data: {
      languages: languageData,
      total_items: sourceStats?.total_items || 0,
      last_updated: sourceStats?.last_updated || new Date().toISOString(),
    },
  });
});

// Get growth metrics with historical trends
exports.getGrowthMetrics = catchAsync(async (req, res) => {
  const { source = "github", days = 7 } = req.query;

  const validSources = ["github", "hackernews"];
  if (!validSources.includes(source.toLowerCase())) {
    throw new ApiError(400, "Invalid source. Must be github or hackernews");
  }

  logger.info(`Fetching growth metrics for ${source} over ${days} days`);

  const growth = await sqlService.getGrowthMetrics(
    source.toLowerCase(),
    parseInt(days)
  );

  res.status(200).json({
    status: "success",
    source,
    days: parseInt(days),
    data: growth,
  });
});

// Get language growth trends
exports.getLanguageGrowth = catchAsync(async (req, res) => {
  const { days = 7 } = req.query;

  logger.info(`Fetching language growth trends over ${days} days`);

  const languageGrowth = await sqlService.getLanguageGrowth(parseInt(days));

  res.status(200).json({
    status: "success",
    days: parseInt(days),
    data: languageGrowth,
  });
});
