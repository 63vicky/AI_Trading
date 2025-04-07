const mongoose = require('mongoose');

const TradingStrategySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['MOMENTUM', 'MEAN_REVERSION', 'ARBITRAGE', 'ML_PREDICTION'],
    required: true,
  },
  parameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  performance: {
    winRate: Number,
    averageReturn: Number,
    maxDrawdown: Number,
    sharpeRatio: Number,
    lastUpdated: Date,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'TESTING'],
    default: 'TESTING',
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: true,
  },
  minimumCapital: {
    type: Number,
    required: true,
  },
  aiModel: {
    type: String,
    required: function () {
      return this.type === 'ML_PREDICTION';
    },
  },
  backtestResults: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
TradingStrategySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TradingStrategy', TradingStrategySchema);
