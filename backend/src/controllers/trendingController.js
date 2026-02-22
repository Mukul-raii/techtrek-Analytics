const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const cosmosService = require("../services/cosmosService");
const sqlService = require("../services/sqlService");
const logger = require("../utils/logger");

// Get all trending items
exports.getAllTrending = catchAsync(async (req, res) => {
  const {
    limit = 50,
    page = 1,
    pageSize = 50,
    source,
    timeRange = "week",
    sort = "popularity",
    language,
    minStars,
    minPoints,
    enhanced = "true",
  } = req.query;

  logger.info(
    `Fetching trending items - limit: ${limit}, source: ${source}, timeRange: ${timeRange}, sort: ${sort}, enhanced: ${enhanced}`
  );

  // Use enhanced trending with momentum and engagement metrics
  const useEnhanced = enhanced === "true";
  const parsedPage = Math.max(parseInt(page) || 1, 1);
  const parsedPageSize = Math.min(Math.max(parseInt(pageSize) || 50, 1), 100);
  const parsedLimit = parseInt(limit) || parsedPageSize;

  const items = useEnhanced
    ? await cosmosService.getEnhancedTrendingItems({
        limit: parsedLimit,
        page: parsedPage,
        pageSize: parsedPageSize,
        source,
        timeRange,
        sort,
        language,
        minStars: minStars ? parseInt(minStars) : undefined,
        minPoints: minPoints ? parseInt(minPoints) : undefined,
      })
    : await cosmosService.getTrendingItems({
        limit: parsedLimit,
        page: parsedPage,
        pageSize: parsedPageSize,
        source,
        timeRange,
        sort,
        language,
        minStars: minStars ? parseInt(minStars) : undefined,
        minPoints: minPoints ? parseInt(minPoints) : undefined,
      });

  const data = Array.isArray(items) ? items : items.data || [];
  const total = Array.isArray(items)
    ? data.length
    : typeof items.total === "number"
      ? items.total
      : data.length;

  res.status(200).json({
    status: "success",
    count: data.length,
    total,
    page: parsedPage,
    pageSize: parsedPageSize,
    totalPages: Math.max(Math.ceil(total / parsedPageSize), 1),
    timeRange,
    enhanced: useEnhanced,
    data,
  });
});

// Get trending by specific source
exports.getTrendingBySource = catchAsync(async (req, res) => {
  const { source } = req.params;
  const {
    limit = 50,
    page = 1,
    pageSize = 50,
    timeRange = "week",
    sort = "popularity",
    language,
    minStars,
    minPoints,
    enhanced = "true",
  } = req.query;

  const validSources = ["github", "hackernews"];
  if (!validSources.includes(source.toLowerCase())) {
    throw new ApiError(400, "Invalid source. Must be github or hackernews");
  }
  const normalizedSource = source.toLowerCase();
  const validSortsBySource = {
    github: ["popularity", "recent", "stars", "stars_asc"],
    hackernews: ["popularity", "recent", "score", "score_asc"],
  };
  if (!validSortsBySource[normalizedSource].includes(sort)) {
    throw new ApiError(
      400,
      `Invalid sort for ${normalizedSource}. Allowed: ${validSortsBySource[
        normalizedSource
      ].join(", ")}`
    );
  }

  const parsedPage = Math.max(parseInt(page) || 1, 1);
  const parsedPageSize = Math.min(Math.max(parseInt(pageSize) || 50, 1), 100);
  const parsedLimit = parseInt(limit) || parsedPageSize;

  logger.info(
    `Fetching trending items for source: ${source}, timeRange: ${timeRange}`
  );

  // Use enhanced trending with momentum and engagement metrics
  const useEnhanced = enhanced === "true";
  const items = useEnhanced
    ? await cosmosService.getEnhancedTrendingItems({
        limit: parsedLimit,
        page: parsedPage,
        pageSize: parsedPageSize,
        source: normalizedSource,
        timeRange,
        sort,
        language,
        minStars: minStars ? parseInt(minStars) : undefined,
        minPoints: minPoints ? parseInt(minPoints) : undefined,
      })
    : await cosmosService.getTrendingItems({
        limit: parsedLimit,
        page: parsedPage,
        pageSize: parsedPageSize,
        source: normalizedSource,
        timeRange,
        sort,
        language,
        minStars: minStars ? parseInt(minStars) : undefined,
        minPoints: minPoints ? parseInt(minPoints) : undefined,
      });
  const data = Array.isArray(items) ? items : items.data || [];
  const total = Array.isArray(items)
    ? data.length
    : typeof items.total === "number"
      ? items.total
      : data.length;

  res.status(200).json({
    status: "success",
    source: normalizedSource,
    timeRange,
    count: data.length,
    total,
    page: parsedPage,
    pageSize: parsedPageSize,
    totalPages: Math.max(Math.ceil(total / parsedPageSize), 1),
    enhanced: useEnhanced,
    data,
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
