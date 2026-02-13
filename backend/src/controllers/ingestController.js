const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const ingestService = require("../services/ingestService");
const schedulerService = require("../services/schedulerService");
const logger = require("../utils/logger");

// Manual data ingestion
exports.manualIngest = catchAsync(async (req, res) => {
  const { source } = req.body;

  if (!source) {
    throw new ApiError(
      400,
      "Source is required. Must be github, hackernews, or all"
    );
  }

  const validSources = ["github", "hackernews", "all"];
  if (!validSources.includes(source.toLowerCase())) {
    throw new ApiError(
      400,
      "Invalid source. Must be github, hackernews, or all"
    );
  }

  logger.info(`Manual ingestion triggered for source: ${source}`);

  // Start ingestion asynchronously
  ingestService
    .ingestData(source.toLowerCase())
    .then((result) => {
      logger.info(
        `Ingestion completed for ${source}: ${JSON.stringify(result)}`
      );
    })
    .catch((error) => {
      logger.error(`Ingestion failed for ${source}: ${error.message}`);
    });

  res.status(202).json({
    status: "success",
    message: `Data ingestion started for ${source}`,
    timestamp: new Date().toISOString(),
  });
});

// Get ingestion status
exports.getIngestionStatus = catchAsync(async (req, res) => {
  const status = await ingestService.getIngestionStatus();

  res.status(200).json({
    status: "success",
    data: status,
  });
});

// Get scheduler status
exports.getSchedulerStatus = catchAsync(async (req, res) => {
  const status = schedulerService.getStatus();

  res.status(200).json({
    status: "success",
    data: status,
  });
});

// Start scheduler
exports.startScheduler = catchAsync(async (req, res) => {
  schedulerService.start();

  res.status(200).json({
    status: "success",
    message: "Scheduler started successfully",
    data: schedulerService.getStatus(),
  });
});

// Stop scheduler
exports.stopScheduler = catchAsync(async (req, res) => {
  schedulerService.stop();

  res.status(200).json({
    status: "success",
    message: "Scheduler stopped successfully",
    data: schedulerService.getStatus(),
  });
});

// Trigger a specific job manually
exports.triggerJob = catchAsync(async (req, res) => {
  const { job } = req.params;

  const validJobs = ["github", "hackernews", "all"];
  if (!validJobs.includes(job)) {
    throw new ApiError(
      400,
      `Invalid job. Must be one of: ${validJobs.join(", ")}`
    );
  }

  logger.info(`Manually triggering job: ${job}`);

  // Start job asynchronously
  schedulerService
    .triggerJob(job)
    .then((result) => {
      logger.info(`Job ${job} completed: ${JSON.stringify(result)}`);
    })
    .catch((error) => {
      logger.error(`Job ${job} failed: ${error.message}`);
    });

  res.status(202).json({
    status: "success",
    message: `Job ${job} triggered successfully`,
    timestamp: new Date().toISOString(),
  });
});
