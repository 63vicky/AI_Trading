const { Schema, model } = require('mongoose');

const PerformanceSchema = new Schema({
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  timestamp: { type: Date, required: true },
  metrics: {
    returns: {
      daily: { type: Number },
      weekly: { type: Number },
      monthly: { type: Number },
      ytd: { type: Number },
    },
    risk: {
      volatility: { type: Number },
      sharpeRatio: { type: Number },
      sortinoRatio: { type: Number },
      maxDrawdown: { type: Number },
      valueAtRisk: { type: Number },
    },
    trading: {
      totalTrades: { type: Number },
      winningTrades: { type: Number },
      losingTrades: { type: Number },
      winRate: { type: Number },
      averageWin: { type: Number },
      averageLoss: { type: Number },
      profitFactor: { type: Number },
    },
    position: {
      currentExposure: { type: Number },
      maxExposure: { type: Number },
      leverage: { type: Number },
    },
  },
  marketConditions: {
    volatility: { type: Number },
    trend: { type: String },
    volume: { type: Number },
  },
});

export const Performance = model('Performance', PerformanceSchema);
