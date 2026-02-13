const express = require("express");
const router = express.Router();
const ingestController = require("../controllers/ingestController");

// Manual data ingestion
router.post("/", ingestController.manualIngest);

// Get ingestion status
router.get("/status", ingestController.getIngestionStatus);

// Scheduler management endpoints
router.get("/scheduler/status", ingestController.getSchedulerStatus);
router.post("/scheduler/start", ingestController.startScheduler);
router.post("/scheduler/stop", ingestController.stopScheduler);
router.post("/scheduler/trigger/:job", ingestController.triggerJob);

module.exports = router;
