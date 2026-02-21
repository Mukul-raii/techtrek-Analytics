const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const cosmosService = require("../services/cosmosService");
const sqlService = require("../services/sqlService");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

// Get admin dashboard statistics
exports.getAdminStats = catchAsync(async (req, res) => {
  logger.info("Fetching admin dashboard statistics");

  try {
    // Get data from both sources
    const [githubStats, hackerNewsStats, sqlStats] = await Promise.all([
      cosmosService.getSourceStats("github"),
      cosmosService.getSourceStats("hackernews"),
      sqlService.getTableStats().catch(() => null), // Don't fail if SQL is unavailable
    ]);

    // Get last ingestion time from log files or metadata
    const lastIngestion = await getLastIngestionInfo();

    // Calculate total data size
    const totalItems = (githubStats?.count || 0) + (hackerNewsStats?.count || 0);
    const totalStars = githubStats?.totalStars || 0;
    const totalPoints = hackerNewsStats?.totalPoints || 0;

    res.status(200).json({
      status: "success",
      data: {
        overview: {
          totalItems,
          githubCount: githubStats?.count || 0,
          hackerNewsCount: hackerNewsStats?.count || 0,
          totalStars,
          totalPoints,
        },
        github: githubStats,
        hackerNews: hackerNewsStats,
        sql: sqlStats,
        lastIngestion,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Error fetching admin stats:", error.message);
    throw new ApiError(500, `Failed to fetch admin statistics: ${error.message}`);
  }
});

// Get detailed data metrics
exports.getDataMetrics = catchAsync(async (req, res) => {
  logger.info("Fetching detailed data metrics");

  try {
    const metrics = await cosmosService.getDetailedMetrics();

    res.status(200).json({
      status: "success",
      data: metrics,
    });
  } catch (error) {
    logger.error("Error fetching data metrics:", error.message);
    throw new ApiError(500, `Failed to fetch data metrics: ${error.message}`);
  }
});

// Trigger manual data ingestion
exports.triggerIngestion = catchAsync(async (req, res) => {
  const { source } = req.body;

  logger.info(`Manual ingestion triggered for source: ${source || "all"}`);

  // This would trigger the ingestion service
  // For now, return a success message
  res.status(200).json({
    status: "success",
    message: "Data ingestion triggered successfully",
    source: source || "all",
    triggeredAt: new Date().toISOString(),
  });
});

// Helper function to get last ingestion info
async function getLastIngestionInfo() {
  try {
    const logDir = path.join(__dirname, "../../logs/data_document");
    
    if (!fs.existsSync(logDir)) {
      return {
        lastRun: null,
        status: "No ingestion logs found",
      };
    }

    const files = fs.readdirSync(logDir);
    const jsonFiles = files
      .filter((f) => f.endsWith(".json") && !f.startsWith("ERROR_"))
      .sort()
      .reverse();

    if (jsonFiles.length === 0) {
      return {
        lastRun: null,
        status: "No successful ingestion logs",
      };
    }

    // Get the most recent file timestamp from filename
    const latestFile = jsonFiles[0];
    const timestamp = latestFile.split("_")[0];
    const lastRun = new Date(timestamp.replace(/-/g, ":").replace("T", " ").replace("Z", ""));

    return {
      lastRun: lastRun.toISOString(),
      status: "success",
      lastFile: latestFile,
    };
  } catch (error) {
    logger.error("Error reading ingestion logs:", error.message);
    return {
      lastRun: null,
      status: "Error reading logs",
      error: error.message,
    };
  }
}

module.exports = exports;
