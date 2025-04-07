export interface OrderBookEntry {
  price: number;
  quantity: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: Date;
}

export interface MarketData {
  symbol: string;
  lastPrice: number;
  bidPrice: number;
  askPrice: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: Date;
}

export interface MarketDepth {
  price: number;
  quantity: number;
  side: 'BID' | 'ASK';
}

export interface MarketStatistics {
  symbol: string;
  volume24h: number;
  turnover24h: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}
