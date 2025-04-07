/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('../types/backtest').BacktestConfig} BacktestConfig
 * @typedef {import('../types/backtest').BacktestResult} BacktestResult
 */

const { v4: uuidv4 } = require('uuid');
const { calculateMetrics } = require('../utils/metricsCalculator');
const { simulateTrades } = require('../utils/tradeSimulator');

// In-memory storage for backtest results (replace with database in production)
const backtestResults = {};

/**
 * @param {Request} req
 * @param {Response} res
 */
const runBacktest = async (req, res) => {
  try {
    const config = req.body;

    // Validate config
    if (!config.strategyId || !config.startDate || !config.endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Simulate trades based on strategy
    const trades = await simulateTrades(config);

    // Calculate performance metrics
    const metrics = calculateMetrics(trades, config.initialCapital);

    // Create backtest result
    const result = {
      id: uuidv4(),
      strategyId: config.strategyId,
      startDate: config.startDate,
      endDate: config.endDate,
      initialCapital: config.initialCapital,
      finalCapital: metrics.finalCapital,
      totalReturn: metrics.returns.total,
      annualizedReturn: metrics.returns.annualized,
      sharpeRatio: metrics.risk.sharpeRatio,
      maxDrawdown: metrics.risk.maxDrawdown,
      winRate: metrics.trading.winRate,
      trades,
      equityCurve: metrics.equityCurve,
      drawdown: metrics.drawdown,
      metrics,
    };

    // Store result
    backtestResults[result.id] = result;

    res.json(result);
  } catch (error) {
    console.error('Backtest error:', error);
    res.status(500).json({ message: 'Failed to run backtest' });
  }
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getBacktestHistory = (req, res) => {
  try {
    const results = Object.values(backtestResults);
    res.json(results);
  } catch (error) {
    console.error('Error fetching backtest history:', error);
    res.status(500).json({ message: 'Failed to fetch backtest history' });
  }
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getBacktestResult = (req, res) => {
  try {
    const { id } = req.params;
    const result = backtestResults[id];

    if (!result) {
      return res.status(404).json({ message: 'Backtest result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching backtest result:', error);
    res.status(500).json({ message: 'Failed to fetch backtest result' });
  }
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const deleteBacktestResult = (req, res) => {
  try {
    const { id } = req.params;
    const result = backtestResults[id];

    if (!result) {
      return res.status(404).json({ message: 'Backtest result not found' });
    }

    delete backtestResults[id];
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting backtest result:', error);
    res.status(500).json({ message: 'Failed to delete backtest result' });
  }
};

module.exports = {
  runBacktest,
  getBacktestHistory,
  getBacktestResult,
  deleteBacktestResult,
};
