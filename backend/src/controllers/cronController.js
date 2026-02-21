const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const ingestService = require("../services/ingestService");
const logger = require("../utils/logger");

// Vercel Cron: GitHub ingestion (every 6 hours)
exports.cronGithubIngestion = catchAsync(async (req, res) => {
  // Verify this is a cron request from Vercel
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    logger.warn("Unauthorized cron request attempt");
    throw new ApiError(401, "Unauthorized");
  }

  logger.info("🔄 [VERCEL CRON] Starting GitHub data ingestion...");

  try {
    const result = await ingestService.ingestData("github");

    logger.info("✅ [VERCEL CRON] GitHub ingestion completed", {
      itemsIngested: result.itemsIngested,
      duration: result.duration,
    });

    res.status(200).json({
      status: "success",
      message: "GitHub ingestion completed",
      data: result,
    });
  } catch (error) {
    logger.error("❌ [VERCEL CRON] GitHub ingestion failed:", error.message);
    throw new ApiError(500, `GitHub ingestion failed: ${error.message}`);
  }
});

// Vercel Cron: HackerNews ingestion (every hour)
exports.cronHackerNewsIngestion = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    logger.warn("Unauthorized cron request attempt");
    throw new ApiError(401, "Unauthorized");
  }

  logger.info("🔄 [VERCEL CRON] Starting HackerNews data ingestion...");

  try {
    const result = await ingestService.ingestData("hackernews");

    logger.info("✅ [VERCEL CRON] HackerNews ingestion completed", {
      itemsIngested: result.itemsIngested,
      duration: result.duration,
    });

    res.status(200).json({
      status: "success",
      message: "HackerNews ingestion completed",
      data: result,
    });
  } catch (error) {
    logger.error(
      "❌ [VERCEL CRON] HackerNews ingestion failed:",
      error.message
    );
    throw new ApiError(500, `HackerNews ingestion failed: ${error.message}`);
  }
});

// Vercel Cron: Full ingestion (every 12 hours)
exports.cronFullIngestion = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    logger.warn("Unauthorized cron request attempt");
    throw new ApiError(401, "Unauthorized");
  }

  logger.info("🔄 [VERCEL CRON] Starting full data ingestion...");

  try {
    const result = await ingestService.ingestData("all");

    logger.info("✅ [VERCEL CRON] Full ingestion completed", {
      itemsIngested: result.itemsIngested,
      duration: result.duration,
    });

    res.status(200).json({
      status: "success",
      message: "Full ingestion completed",
      data: result,
    });
  } catch (error) {
    logger.error("❌ [VERCEL CRON] Full ingestion failed:", error.message);
    throw new ApiError(500, `Full ingestion failed: ${error.message}`);
  }
});

// Vercel Cron: SQL population (daily)
exports.cronSQLPopulation = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    logger.warn("Unauthorized cron request attempt");
    throw new ApiError(401, "Unauthorized");
  }

  logger.info("🔄 [VERCEL CRON] Starting SQL population...");

  try {
    const SimpleSQLPopulation = require("../scripts/populate-sql-simple");
    const sqlService = new SimpleSQLPopulation();

    await sqlService.initialize();
    await sqlService.populateAll();
    await sqlService.close();

    logger.info("✅ [VERCEL CRON] SQL population completed");

    res.status(200).json({
      status: "success",
      message: "SQL tables populated successfully",
    });
  } catch (error) {
    logger.error("❌ [VERCEL CRON] SQL population failed:", error.message);
    throw new ApiError(500, `SQL population failed: ${error.message}`);
  }
});

module.exports = exports;
