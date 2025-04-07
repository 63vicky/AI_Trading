export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
  TRAILING_STOP = 'TRAILING_STOP',
}

export enum PositionSide {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum OrderStatus {
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export interface Order {
  id: string;
  symbol: string;
  side: PositionSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
  status: OrderStatus;
  timestamp: Date;
  strategyId: string;
}

export interface Position {
  symbol: string;
  size: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  timestamp: Date;
}

export interface Trade {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  orderId: string;
  strategyId: string;
}
