const express = require('express');
const router = express.Router();
const ingestController = require('../controllers/ingestController');

// Manual data ingestion
router.post('/', ingestController.manualIngest);

// Get ingestion status
router.get('/status', ingestController.getIngestionStatus);

module.exports = router;
