export interface LiveData {
  activeStrategies: number;
  openPositions: number;
  todayPnL: number;
  totalExposure: number;
  positions: Position[];
  orders: Order[];
  marketData: MarketDataPoint[];
}

export interface Position {
  id: string;
  symbol: string;
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  strategy: string;
}

export interface Order {
  id: string;
  timestamp: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  price?: number;
  size: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
}

export interface MarketDataPoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface PerformanceData {
  metrics: {
    returns: {
      total: number;
      daily: number;
      weekly: number;
      monthly: number;
      ytd: number;
    };
    risk: {
      sharpeRatio: number;
      sortinoRatio: number;
      maxDrawdown: number;
      valueAtRisk: number;
    };
    trading: {
      totalTrades: number;
      winningTrades: number;
      losingTrades: number;
      winRate: number;
      averageWin: number;
      averageLoss: number;
      profitFactor: number;
    };
  };
  equityCurve: EquityPoint[];
  drawdown: DrawdownPoint[];
  recentTrades: Trade[];
}

export interface EquityPoint {
  date: string;
  equity: number;
}

export interface DrawdownPoint {
  date: string;
  drawdown: number;
}

export interface Trade {
  id: string;
  timestamp: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  size: number;
  pnl: number;
}

export interface RiskParameters {
  circuitBreaker: boolean;
  maxDrawdown: number;
  maxPositionSize: number;
  maxLeverage: number;
  stopLoss: number;
  takeProfit: number;
  currentExposure: number;
  var: number;
  beta: number;
  volatility: number;
}

export interface StrategyConfig {
  name: string;
  type: string;
  parameters: {
    symbol: string;
    lookbackPeriod: number;
    threshold: number;
    positionSize: number;
  };
  riskParameters: {
    maxDrawdown: number;
    maxPositionSize: number;
    maxLeverage: number;
    stopLoss: number;
    takeProfit: number;
  };
}
