const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware.protect);

// Get all available strategies
router.get('/', async (req, res) => {
  try {
    const strategies = [
      {
        id: 'sma_strategy_1',
        name: 'Simple Moving Average',
        description:
          'Strategy based on price crossing above/below moving average',
        parameters: {
          lookbackPeriod: { type: 'number', default: 20, min: 5, max: 200 },
          threshold: { type: 'number', default: 0.02, min: 0.001, max: 0.1 },
          positionSize: { type: 'number', default: 0.1, min: 0.01, max: 1 },
        },
      },
      {
        id: 'momentum_strategy_1',
        name: 'Momentum',
        description: 'Strategy based on price momentum and volume',
        parameters: {
          lookbackPeriod: { type: 'number', default: 14, min: 5, max: 100 },
          threshold: { type: 'number', default: 0.05, min: 0.001, max: 0.2 },
          volumeThreshold: { type: 'number', default: 1.5, min: 1, max: 5 },
        },
      },
    ];
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching strategies' });
  }
});

// Get strategy details
router.get('/:strategyId', async (req, res) => {
  try {
    const { strategyId } = req.params;
    // TODO: Implement actual strategy details fetching
    const strategy = {
      id: strategyId,
      name: 'Simple Moving Average',
      description:
        'Strategy based on price crossing above/below moving average',
      parameters: {
        lookbackPeriod: { type: 'number', default: 20, min: 5, max: 200 },
        threshold: { type: 'number', default: 0.02, min: 0.001, max: 0.1 },
        positionSize: { type: 'number', default: 0.1, min: 0.01, max: 1 },
      },
      performance: {
        totalReturn: 0.15,
        annualizedReturn: 0.25,
        sharpeRatio: 1.8,
      },
    };
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching strategy details' });
  }
});

// Create a new strategy
router.post('/', async (req, res) => {
  try {
    const strategy = req.body;
    // TODO: Implement actual strategy creation
    res.status(201).json({
      message: 'Strategy created successfully',
      strategyId: 'new_strategy_1',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating strategy' });
  }
});

// Update a strategy
router.put('/:strategyId', async (req, res) => {
  try {
    const { strategyId } = req.params;
    const updates = req.body;
    // TODO: Implement actual strategy update
    res.json({
      message: 'Strategy updated successfully',
      strategyId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating strategy' });
  }
});

// Delete a strategy
router.delete('/:strategyId', async (req, res) => {
  try {
    const { strategyId } = req.params;
    // TODO: Implement actual strategy deletion
    res.json({
      message: 'Strategy deleted successfully',
      strategyId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting strategy' });
  }
});

module.exports = router;
