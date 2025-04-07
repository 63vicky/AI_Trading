const Trade = require('../models/Trade');
const TradingStrategy = require('../models/TradingStrategy');

// Create a new trade
exports.createTrade = async (req, res) => {
  try {
    const {
      strategy,
      symbol,
      type,
      entryPrice,
      quantity,
      stopLoss,
      takeProfit,
      aiConfidence,
    } = req.body;

    // Validate strategy exists
    const strategyExists = await TradingStrategy.findById(strategy);
    if (!strategyExists) {
      return res.status(404).json({ message: 'Trading strategy not found' });
    }

    // Calculate risk-reward ratio if both stopLoss and takeProfit are provided
    let riskRewardRatio;
    if (stopLoss && takeProfit) {
      const risk = Math.abs(entryPrice - stopLoss);
      const reward = Math.abs(takeProfit - entryPrice);
      riskRewardRatio = reward / risk;
    }

    const trade = new Trade({
      strategy,
      symbol,
      type,
      entryPrice,
      quantity,
      stopLoss,
      takeProfit,
      riskRewardRatio,
      aiConfidence,
      status: 'OPEN',
    });

    await trade.save();
    res.status(201).json(trade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all trades
exports.getTrades = async (req, res) => {
  try {
    const { status, strategy, symbol, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (strategy) query.strategy = strategy;
    if (symbol) query.symbol = symbol;
    if (startDate || endDate) {
      query.entryTime = {};
      if (startDate) query.entryTime.$gte = new Date(startDate);
      if (endDate) query.entryTime.$lte = new Date(endDate);
    }

    const trades = await Trade.find(query)
      .populate('strategy')
      .sort({ entryTime: -1 });

    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single trade
exports.getTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id).populate('strategy');
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    res.json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a trade
exports.updateTrade = async (req, res) => {
  try {
    const { exitPrice, status } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (status === 'CLOSED' && exitPrice) {
      trade.exitPrice = exitPrice;
      trade.exitTime = new Date();
    }

    trade.status = status;
    await trade.save();
    res.json(trade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a trade
exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    await trade.remove();
    res.json({ message: 'Trade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trade statistics
exports.getTradeStats = async (req, res) => {
  try {
    const { strategy, symbol, startDate, endDate } = req.query;
    const query = { status: 'CLOSED' };

    if (strategy) query.strategy = strategy;
    if (symbol) query.symbol = symbol;
    if (startDate || endDate) {
      query.exitTime = {};
      if (startDate) query.exitTime.$gte = new Date(startDate);
      if (endDate) query.exitTime.$lte = new Date(endDate);
    }

    const trades = await Trade.find(query);

    const stats = {
      totalTrades: trades.length,
      winningTrades: trades.filter((t) => t.profitLoss > 0).length,
      losingTrades: trades.filter((t) => t.profitLoss < 0).length,
      totalProfitLoss: trades.reduce((sum, t) => sum + t.profitLoss, 0),
      averageProfitLoss:
        trades.reduce((sum, t) => sum + t.profitLoss, 0) / trades.length,
      winRate:
        trades.length > 0
          ? (trades.filter((t) => t.profitLoss > 0).length / trades.length) *
            100
          : 0,
      averageHoldingTime:
        trades.length > 0
          ? trades.reduce((sum, t) => sum + (t.exitTime - t.entryTime), 0) /
            trades.length
          : 0,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
