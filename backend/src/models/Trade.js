const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  strategy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TradingStrategy',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['LONG', 'SHORT'],
    required: true,
  },
  entryPrice: {
    type: Number,
    required: true,
  },
  exitPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'CANCELLED'],
    default: 'OPEN',
  },
  entryTime: {
    type: Date,
    default: Date.now,
  },
  exitTime: {
    type: Date,
  },
  profitLoss: {
    type: Number,
  },
  profitLossPercentage: {
    type: Number,
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 1,
  },
  stopLoss: {
    type: Number,
  },
  takeProfit: {
    type: Number,
  },
  riskRewardRatio: {
    type: Number,
  },
  metadata: {
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
TradeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Calculate P&L if trade is closed
  if (this.status === 'CLOSED' && this.exitPrice) {
    const multiplier = this.type === 'LONG' ? 1 : -1;
    this.profitLoss =
      (this.exitPrice - this.entryPrice) * this.quantity * multiplier;
    this.profitLossPercentage =
      (this.profitLoss / (this.entryPrice * this.quantity)) * 100;
  }

  next();
});

module.exports = mongoose.model('Trade', TradeSchema);
