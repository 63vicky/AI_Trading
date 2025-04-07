export interface BacktestResult {
  id: string;
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  trades: Trade[];
  equityCurve: EquityPoint[];
  drawdown: DrawdownPoint[];
  metrics: {
    returns: {
      total: number;
      annualized: number;
      daily: number;
      monthly: number;
    };
    risk: {
      sharpeRatio: number;
      sortinoRatio: number;
      maxDrawdown: number;
      volatility: number;
      beta: number;
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
}

export interface Trade {
  id: string;
  timestamp: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  size: number;
  pnl: number;
  commission: number;
  strategy: string;
}

export interface EquityPoint {
  date: string;
  equity: number;
  returns: number;
}

export interface DrawdownPoint {
  date: string;
  drawdown: number;
  peak: number;
  trough: number;
}

export interface BacktestConfig {
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
  slippage: number;
  parameters: {
    symbol?: string;
    lookbackPeriod?: number;
    threshold?: number;
    positionSize?: number;
    [key: string]: string | number | boolean | undefined;
  };
}
