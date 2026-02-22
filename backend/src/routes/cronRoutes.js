const express = require("express");
const router = express.Router();
const cronController = require("../controllers/cronController");

// Vercel Cron Jobs
router.get("/github-ingestion", cronController.cronGithubIngestion);
router.post("/github-ingestion", cronController.cronGithubIngestion);

router.get("/hackernews-ingestion", cronController.cronHackerNewsIngestion);
router.post("/hackernews-ingestion", cronController.cronHackerNewsIngestion);

router.get("/full-ingestion", cronController.cronFullIngestion);
router.post("/full-ingestion", cronController.cronFullIngestion);

router.get("/sql-population", cronController.cronSQLPopulation);
router.post("/sql-population", cronController.cronSQLPopulation);

module.exports = router;
