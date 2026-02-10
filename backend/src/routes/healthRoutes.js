const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// System health check
router.get('/', healthController.checkHealth);

// Service-specific health checks
router.get('/cosmos', healthController.checkCosmosDB);
router.get('/sql', healthController.checkSQL);
router.get('/search', healthController.checkSearch);

module.exports = router;
