import { OrderType, PositionSide } from '../types/trading';

export interface StrategyConfig {
  id: string;
  name: string;
  type: StrategyType;
  parameters: Record<string, any>;
  riskParameters: RiskParameters;
  enabled: boolean;
}

export interface RiskParameters {
  maxPositionSize: number;
  maxDrawdown: number;
  stopLoss: number;
  takeProfit: number;
  maxLeverage: number;
}

export enum StrategyType {
  ARBITRAGE = 'ARBITRAGE',
  MARKET_MAKING = 'MARKET_MAKING',
  STATISTICAL_ARBITRAGE = 'STATISTICAL_ARBITRAGE',
  MEAN_REVERSION = 'MEAN_REVERSION',
  TREND_FOLLOWING = 'TREND_FOLLOWING',
  HIGH_FREQUENCY = 'HIGH_FREQUENCY',
}

export interface TradeSignal {
  symbol: string;
  side: PositionSide;
  orderType: OrderType;
  price: number;
  quantity: number;
  strategyId: string;
  timestamp: Date;
  confidence: number;
}

export interface StrategyPerformance {
  strategyId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalPnL: number;
  startDate: Date;
  endDate: Date;
}
