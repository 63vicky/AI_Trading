const types = require('../types/backtest.js');

/**
 * @typedef {Object} Trade
 * @property {string} id
 * @property {string} timestamp
 * @property {string} symbol
 * @property {string} type
 * @property {number} price
 * @property {number} quantity
 * @property {number} pnl
 */

/**
 * @typedef {Object} Position
 * @property {string} symbol
 * @property {string} side
 * @property {number} quantity
 * @property {number} entryPrice
 * @property {number} currentPrice
 * @property {number} unrealizedPnL
 */

/**
 * @typedef {Object} MarketData
 * @property {string} timestamp
 * @property {string} symbol
 * @property {number} open
 * @property {number} high
 * @property {number} low
 * @property {number} close
 * @property {number} volume
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} timestamp
 * @property {string} symbol
 * @property {string} type
 * @property {string} side
 * @property {number} price
 * @property {number} quantity
 * @property {string} status
 */

/**
 * @typedef {Object} TradeSimulatorOptions
 * @property {number} initialCapital
 * @property {number} maxPositionSize
 * @property {number} maxOpenPositions
 * @property {number} slippage
 * @property {number} commission
 */

class TradeSimulator {
  /**
   * @param {TradeSimulatorOptions} options
   */
  constructor(options) {
    this.options = {
      initialCapital: 100000,
      maxPositionSize: 0.1,
      maxOpenPositions: 5,
      slippage: 0.001,
      commission: 0.001,
      ...options,
    };

    this.capital = this.options.initialCapital;
    this.positions = new Map();
    this.trades = [];
    this.orders = [];
  }

  /**
   * @param {MarketData} marketData
   * @param {Order} order
   * @returns {Trade}
   */
  executeOrder(marketData, order) {
    const { symbol, type, side, price, quantity } = order;
    const executionPrice = this.calculateExecutionPrice(marketData, order);
    const commission = executionPrice * quantity * this.options.commission;
    const totalCost = executionPrice * quantity + commission;

    if (totalCost > this.capital) {
      throw new Error('Insufficient capital');
    }

    const trade = {
      id: `trade_${Date.now()}`,
      timestamp: marketData.timestamp,
      symbol,
      type,
      price: executionPrice,
      quantity,
      pnl: 0,
    };

    this.capital -= totalCost;
    this.trades.push(trade);
    this.updatePosition(marketData, trade);

    return trade;
  }

  /**
   * @param {MarketData} marketData
   * @param {Order} order
   * @returns {number}
   */
  calculateExecutionPrice(marketData, order) {
    const { price, side } = order;
    const slippage = price * this.options.slippage;

    if (side === 'buy') {
      return price + slippage;
    } else {
      return price - slippage;
    }
  }

  /**
   * @param {MarketData} marketData
   * @param {Trade} trade
   */
  updatePosition(marketData, trade) {
    const { symbol, type, price, quantity } = trade;
    const position = this.positions.get(symbol) || {
      symbol,
      side: type === 'buy' ? 'long' : 'short',
      quantity: 0,
      entryPrice: 0,
      currentPrice: price,
      unrealizedPnL: 0,
    };

    if (type === 'buy') {
      position.quantity += quantity;
      position.entryPrice =
        (position.entryPrice * (position.quantity - quantity) +
          price * quantity) /
        position.quantity;
    } else {
      position.quantity -= quantity;
      if (position.quantity === 0) {
        this.positions.delete(symbol);
      }
    }

    position.currentPrice = marketData.close;
    position.unrealizedPnL = this.calculateUnrealizedPnL(position);

    if (position.quantity !== 0) {
      this.positions.set(symbol, position);
    }
  }

  /**
   * @param {Position} position
   * @returns {number}
   */
  calculateUnrealizedPnL(position) {
    const { side, quantity, entryPrice, currentPrice } = position;
    const priceDiff = currentPrice - entryPrice;

    if (side === 'long') {
      return quantity * priceDiff;
    } else {
      return quantity * -priceDiff;
    }
  }

  /**
   * @param {MarketData} marketData
   */
  updatePositions(marketData) {
    for (const [symbol, position] of this.positions) {
      position.currentPrice = marketData.close;
      position.unrealizedPnL = this.calculateUnrealizedPnL(position);
    }
  }

  /**
   * @returns {Array<Position>}
   */
  getPositions() {
    return Array.from(this.positions.values());
  }

  /**
   * @returns {Array<Trade>}
   */
  getTrades() {
    return this.trades;
  }

  /**
   * @returns {number}
   */
  getCapital() {
    return this.capital;
  }

  /**
   * @returns {number}
   */
  getTotalPnL() {
    const realizedPnL = this.trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const unrealizedPnL = Array.from(this.positions.values()).reduce(
      (sum, position) => sum + position.unrealizedPnL,
      0
    );
    return realizedPnL + unrealizedPnL;
  }
}

module.exports = TradeSimulator;
