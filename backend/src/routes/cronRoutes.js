const express = require("express");
const router = express.Router();
const cronController = require("../controllers/cronController");

// Vercel Cron Jobs
router.post("/github-ingestion", cronController.cronGithubIngestion);
router.post("/hackernews-ingestion", cronController.cronHackerNewsIngestion);
router.post("/full-ingestion", cronController.cronFullIngestion);
router.post("/sql-population", cronController.cronSQLPopulation);

module.exports = router;
