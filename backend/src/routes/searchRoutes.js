const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);

// Search endpoint
router.get('/', searchController.search);

// Autocomplete suggestions
router.get('/suggest', searchController.suggest);

module.exports = router;
