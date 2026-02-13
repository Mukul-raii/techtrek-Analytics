const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const rateLimiter = require("../middleware/rateLimiter");

router.use(rateLimiter);

// Get overall analytics
router.get("/", analyticsController.getOverallAnalytics);

// Get daily metrics
router.get("/daily", analyticsController.getDailyMetrics);

// Get language statistics
router.get("/languages/stats", analyticsController.getLanguageStats);

// Get language growth trends
router.get("/languages/growth", analyticsController.getLanguageGrowth);

// Get growth metrics (with historical comparison)
router.get("/growth", analyticsController.getGrowthMetrics);

// Get source-specific analytics
router.get("/:source", analyticsController.getSourceAnalytics);

module.exports = router;
