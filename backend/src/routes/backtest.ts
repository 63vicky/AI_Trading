const express = require('express');

const {
  runBacktest,
  getBacktestHistory,
  getBacktestResult,
  deleteBacktestResult,
} = require('../controllers/backtestController');

const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protected routes
router.use(authMiddleware.protect);

// Run a new backtest
router.post('/', runBacktest);

// Get backtest history
router.get('/', getBacktestHistory);

// Get specific backtest result
router.get('/:id', getBacktestResult);

// Delete backtest result
router.delete('/:id', deleteBacktestResult);

module.exports = router;
