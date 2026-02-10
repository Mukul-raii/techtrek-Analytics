const app = require("./app");
const config = require("./config/config");
const logger = require("./utils/logger");
const cosmosService = require("./services/cosmosService");
const sqlService = require("./services/sqlService");
const searchService = require("./services/searchService");

const PORT = config.port || 5000;

async function startServer() {
  try {
    // Initialize services
    logger.info("Initializing services...");

    // Initialize services in parallel, but don't fail if some are unavailable
    const results = await Promise.allSettled([
      cosmosService.initialize(),
      sqlService.initialize(),
      searchService.initialize(),
    ]);

    // Log service initialization results
    const [cosmosResult, sqlResult, searchResult] = results;

    if (cosmosResult.status === "fulfilled") {
      logger.info("✅ Cosmos DB initialized successfully");
    } else {
      logger.error(
        "❌ Cosmos DB initialization failed:",
        cosmosResult.reason?.message
      );
    }

    if (sqlResult.status === "fulfilled") {
      logger.info("✅ SQL Database initialized successfully");
    } else {
      logger.warn(
        "⚠️ SQL Database initialization failed (continuing without SQL):",
        sqlResult.reason?.message
      );
    }

    if (searchResult.status === "fulfilled") {
      logger.info("✅ Search Service initialized successfully");
    } else {
      logger.warn(
        "⚠️ Search Service initialization failed (continuing without Search):",
        searchResult.reason?.message
      );
    }

    // Only fail if Cosmos DB (critical service) fails
    if (cosmosResult.status === "rejected") {
      throw new Error("Critical service (Cosmos DB) failed to initialize");
    }

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 TechPulse Analytics Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
      logger.info(`🌐 CORS enabled for: ${config.corsOrigin}`);
    });

    return server;
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// For serverless (Vercel), export the app directly
if (process.env.VERCEL) {
  // Initialize services asynchronously but don't wait
  startServer().catch((err) => {
    logger.error("Failed to initialize services:", err);
  });
  // Export app for serverless
  module.exports = app;
} else {
  // For local development, start the server normally
  const server = startServer();

  process.on("unhandledRejection", (err) => {
    logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
    logger.error(err.name, err.message);
    if (server) {
      server.then((s) => s.close(() => process.exit(1)));
    } else {
      process.exit(1);
    }
  });

  process.on("SIGTERM", () => {
    logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
    if (server) {
      server.then((s) =>
        s.close(() => {
          logger.info("💥 Process terminated!");
        })
      );
    }
  });

  module.exports = server;
}
