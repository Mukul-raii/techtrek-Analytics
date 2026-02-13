const express = require("express");
const router = express.Router();
const trendingController = require("../controllers/trendingController");
const rateLimiter = require("../middleware/rateLimiter");

// Apply rate limiting
router.use(rateLimiter);

// Get trending topics/tags from SQL
router.get("/topics/trending", trendingController.getTrendingTopics);

// Get all trending items
router.get("/", trendingController.getAllTrending);

// Get trending by source
router.get("/:source", trendingController.getTrendingBySource);

module.exports = router;
