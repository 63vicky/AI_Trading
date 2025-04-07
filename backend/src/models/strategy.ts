const { Schema, model } = require('mongoose');

export enum StrategyType {
  HFT = 'HFT',
  STATISTICAL_ARBITRAGE = 'STATISTICAL_ARBITRAGE',
  MARKET_MAKING = 'MARKET_MAKING',
  MEAN_REVERSION = 'MEAN_REVERSION',
  TREND_FOLLOWING = 'TREND_FOLLOWING',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
}

export enum StrategyStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  BACKTESTING = 'BACKTESTING',
}

const StrategySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(StrategyType), required: true },
  status: {
    type: String,
    enum: Object.values(StrategyStatus),
    default: StrategyStatus.STOPPED,
  },
  parameters: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true,
  },
  riskParameters: {
    maxDrawdown: { type: Number, required: true },
    maxPositionSize: { type: Number, required: true },
    maxLeverage: { type: Number, required: true },
    stopLoss: { type: Number, required: true },
    takeProfit: { type: Number, required: true },
  },
  performanceMetrics: {
    sharpeRatio: { type: Number },
    sortinoRatio: { type: Number },
    maxDrawdown: { type: Number },
    winRate: { type: Number },
    profitFactor: { type: Number },
  },
  backtestResults: {
    startDate: { type: Date },
    endDate: { type: Date },
    totalReturn: { type: Number },
    trades: { type: Number },
    metrics: { type: Map, of: Schema.Types.Mixed },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Strategy = model('Strategy', StrategySchema);
