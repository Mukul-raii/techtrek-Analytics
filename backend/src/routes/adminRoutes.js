const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin dashboard statistics
router.get("/stats", adminController.getAdminStats);

// Detailed data metrics
router.get("/metrics", adminController.getDataMetrics);

// Trigger manual ingestion
router.post("/ingest", adminController.triggerIngestion);

module.exports = router;
