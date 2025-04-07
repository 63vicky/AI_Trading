const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware.protect);

// Market data routes
router.get('/data/:symbol', marketController.getMarketData);
router.get('/historical', marketController.getHistoricalData);
router.get('/summary', marketController.getMarketSummary);
router.get('/search', marketController.searchSymbols);
router.get('/technical', marketController.getTechnicalIndicators);

module.exports = router;
