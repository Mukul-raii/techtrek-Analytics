const cron = require("node-cron");
const ingestService = require("./ingestService");
const logger = require("../utils/logger");
const config = require("../config/config");
const SimpleSQLPopulation = require("../scripts/populate-sql-simple");

class SchedulerService {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  /**
   * Start all scheduled jobs
   */
  start() {
    if (this.isRunning) {
      logger.warn("Scheduler already running");
      return;
    }

    // Only run scheduled jobs in production or if explicitly enabled
    const enableScheduler =
      config.nodeEnv === "production" ||
      process.env.ENABLE_SCHEDULER === "true";

    if (!enableScheduler) {
      logger.info(
        "⏰ Scheduler disabled in development. Set ENABLE_SCHEDULER=true to enable."
      );
      return;
    }

    logger.info("🚀 Starting scheduler service...");

    // GitHub trending ingestion - Every 6 hours
    const githubJob = cron.schedule("0 */6 * * *", async () => {
      try {
        logger.info("⏰ [SCHEDULED] Starting GitHub data ingestion...");
        const result = await ingestService.ingestData("github");
        logger.info("✅ [SCHEDULED] GitHub ingestion completed:", {
          itemsIngested: result.itemsIngested,
          duration: result.duration,
        });
      } catch (error) {
        logger.error("❌ [SCHEDULED] GitHub ingestion failed:", error.message);
      }
    });

    // HackerNews ingestion - Every 1 hour
    const hackerNewsJob = cron.schedule("0 * * * *", async () => {
      try {
        logger.info("⏰ [SCHEDULED] Starting HackerNews data ingestion...");
        const result = await ingestService.ingestData("hackernews");
        logger.info("✅ [SCHEDULED] HackerNews ingestion completed:", {
          itemsIngested: result.itemsIngested,
          duration: result.duration,
        });
      } catch (error) {
        logger.error(
          "❌ [SCHEDULED] HackerNews ingestion failed:",
          error.message
        );
      }
    });

    // Full ingestion (both sources) - Every 12 hours at midnight and noon
    const fullIngestJob = cron.schedule("0 0,12 * * *", async () => {
      try {
        logger.info(
          "⏰ [SCHEDULED] Starting full data ingestion (GitHub + HackerNews)..."
        );
        const result = await ingestService.ingestData("all");
        logger.info("✅ [SCHEDULED] Full ingestion completed:", {
          itemsIngested: result.itemsIngested,
          duration: result.duration,
        });
      } catch (error) {
        logger.error("❌ [SCHEDULED] Full ingestion failed:", error.message);
      }
    });

    // SQL Tables Population - Daily at midnight UTC
    const sqlPopulationJob = cron.schedule("0 0 * * *", async () => {
      try {
        logger.info("⏰ [SCHEDULED] Starting daily SQL population...");
        const sqlService = new SimpleSQLPopulation();

        await sqlService.initialize();
        await sqlService.populateAll();
        await sqlService.close();

        logger.info("✅ [SCHEDULED] SQL population completed successfully");
      } catch (error) {
        logger.error("❌ [SCHEDULED] SQL population failed:", error.message);
      }
    });

    // Store job references
    this.jobs.set("github", githubJob);
    this.jobs.set("hackernews", hackerNewsJob);
    this.jobs.set("full", fullIngestJob);
    this.jobs.set("sqlPopulation", sqlPopulationJob);

    this.isRunning = true;

    logger.info("✅ Scheduler started successfully with following jobs:");
    logger.info("   📦 GitHub ingestion: Every 6 hours");
    logger.info("   📰 HackerNews ingestion: Every 1 hour");
    logger.info("   🔄 Full ingestion: Every 12 hours (midnight & noon)");
    logger.info("   💾 SQL population: Daily at midnight UTC");

    // Run initial ingestion on startup (after 30 seconds delay)
    setTimeout(async () => {
      try {
        logger.info("🚀 Running initial data ingestion on startup...");
        await ingestService.ingestData("all");
        logger.info("✅ Initial ingestion completed");
      } catch (error) {
        logger.error("❌ Initial ingestion failed:", error.message);
      }
    }, 30000); // 30 second delay
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    if (!this.isRunning) {
      logger.warn("Scheduler is not running");
      return;
    }

    logger.info("⏹️  Stopping scheduler service...");

    // Stop all jobs
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`   Stopped ${name} job`);
    });

    this.jobs.clear();
    this.isRunning = false;

    logger.info("✅ Scheduler stopped successfully");
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    const lastIngestion = ingestService.lastIngestion;

    return {
      isRunning: this.isRunning,
      activeJobs: Array.from(this.jobs.keys()),
      lastIngestion: lastIngestion
        ? {
            timestamp: lastIngestion.timestamp,
            source: lastIngestion.source,
            status: lastIngestion.status,
            itemsIngested: lastIngestion.itemsIngested,
            duration: lastIngestion.duration,
          }
        : null,
      schedule: {
        github: "Every 6 hours",
        hackernews: "Every 1 hour",
        full: "Every 12 hours (midnight & noon)",
        sqlPopulation: "Daily at midnight UTC",
      },
      nextRuns: this.isRunning ? this._getNextRuns() : null,
    };
  }

  /**
   * Calculate next run times for each job
   * @private
   */
  _getNextRuns() {
    const now = new Date();

    // Calculate next GitHub run (every 6 hours)
    const githubNext = new Date(now);
    const currentHour = now.getHours();
    const nextGithubHour = Math.ceil((currentHour + 1) / 6) * 6;
    githubNext.setHours(nextGithubHour, 0, 0, 0);
    if (nextGithubHour >= 24) {
      githubNext.setDate(githubNext.getDate() + 1);
      githubNext.setHours(nextGithubHour - 24, 0, 0, 0);
    }

    // Calculate next HackerNews run (every hour)
    const hackerNewsNext = new Date(now);
    hackerNewsNext.setHours(now.getHours() + 1, 0, 0, 0);

    // Calculate next full ingestion (midnight or noon)
    const fullNext = new Date(now);
    if (currentHour < 12) {
      fullNext.setHours(12, 0, 0, 0);
    } else {
      fullNext.setDate(fullNext.getDate() + 1);
      fullNext.setHours(0, 0, 0, 0);
    }

    return {
      github: githubNext.toISOString(),
      hackernews: hackerNewsNext.toISOString(),
      full: fullNext.toISOString(),
    };
  }

  /**
   * Manually trigger a job
   */
  async triggerJob(jobName) {
    if (!["github", "hackernews", "all", "sqlPopulation"].includes(jobName)) {
      throw new Error(`Invalid job name: ${jobName}`);
    }

    logger.info(`🔄 Manually triggering ${jobName} job...`);

    if (jobName === "sqlPopulation") {
      const sqlService = new SimpleSQLPopulation();
      try {
        await sqlService.initialize();
        await sqlService.populateAll();
        await sqlService.close();
        return {
          status: "success",
          message: "SQL tables populated successfully",
        };
      } catch (error) {
        logger.error("SQL population failed:", error);
        throw error;
      }
    }

    return await ingestService.ingestData(jobName);
  }
}

// Singleton instance
const schedulerService = new SchedulerService();

module.exports = schedulerService;
