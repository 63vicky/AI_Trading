const { EventEmitter } = require('events');
const marketTypes = require('../types/market');
const tradingTypes = require('../types/trading');

/**
 * @typedef {Object} MarketDataService
 * @property {function(string, string): Promise<MarketData>} getMarketData
 * @property {function(string, string): Promise<OrderBook>} getOrderBook
 * @property {function(string, string): Promise<Array<Trade>>} getTrades
 */

/**
 * @typedef {Object} RiskManagementService
 * @property {function(Position, Order): Promise<boolean>} validateOrder
 * @property {function(Position): Promise<boolean>} validatePosition
 */

/**
 * @typedef {Object} StrategyService
 * @property {function(string, Object): Promise<Strategy>} createStrategy
 * @property {function(Strategy, MarketData): Promise<Array<TradeSignal>>} generateSignals
 */

/**
 * @typedef {Object} TradeSignal
 * @property {string} symbol
 * @property {string} type
 * @property {number} price
 * @property {number} quantity
 */

/**
 * @typedef {Object} Position
 * @property {string} symbol
 * @property {string} type
 * @property {number} quantity
 * @property {number} entryPrice
 * @property {number} currentPrice
 * @property {number} unrealizedPnL
 */

class TradingEngine extends EventEmitter {
  /**
   * @param {MarketDataService} marketDataService
   * @param {RiskManagementService} riskManagementService
   * @param {StrategyService} strategyService
   */
  constructor(marketDataService, riskManagementService, strategyService) {
    super();
    this.marketDataService = marketDataService;
    this.riskManagementService = riskManagementService;
    this.strategyService = strategyService;
    this.positions = new Map();
    this.strategies = new Map();
  }

  /**
   * @param {string} symbol
   * @param {Object} config
   * @returns {Promise<Strategy>}
   */
  async createStrategy(symbol, config) {
    const strategy = await this.strategyService.createStrategy(symbol, config);
    this.strategies.set(symbol, strategy);
    return strategy;
  }

  /**
   * @param {string} symbol
   * @param {string} timeframe
   * @returns {Promise<void>}
   */
  async startTrading(symbol, timeframe) {
    const strategy = this.strategies.get(symbol);
    if (!strategy) {
      throw new Error(`No strategy found for ${symbol}`);
    }

    this.marketDataService.subscribeMarketData(
      symbol,
      timeframe,
      async (marketData) => {
        const signals = await this.strategyService.generateSignals(
          strategy,
          marketData
        );
        for (const signal of signals) {
          await this.processSignal(signal);
        }
      }
    );
  }

  /**
   * @param {TradeSignal} signal
   * @returns {Promise<void>}
   */
  async processSignal(signal) {
    const position = this.positions.get(signal.symbol);
    const order = {
      symbol: signal.symbol,
      type: signal.type,
      price: signal.price,
      quantity: signal.quantity,
    };

    if (await this.riskManagementService.validateOrder(position, order)) {
      await this.executeOrder(order);
    }
  }

  /**
   * @param {Order} order
   * @returns {Promise<void>}
   */
  async executeOrder(order) {
    const position = this.positions.get(order.symbol);
    if (!position) {
      this.positions.set(order.symbol, {
        symbol: order.symbol,
        type: order.type,
        quantity: order.quantity,
        entryPrice: order.price,
        currentPrice: order.price,
        unrealizedPnL: 0,
      });
    } else {
      if (position.type === order.type) {
        position.quantity += order.quantity;
        position.entryPrice =
          (position.entryPrice * position.quantity +
            order.price * order.quantity) /
          (position.quantity + order.quantity);
      } else {
        position.quantity -= order.quantity;
        if (position.quantity === 0) {
          this.positions.delete(order.symbol);
        }
      }
    }

    this.emit('orderExecuted', order);
  }

  /**
   * @param {string} symbol
   * @param {number} price
   * @returns {Promise<void>}
   */
  async updatePositionPrice(symbol, price) {
    const position = this.positions.get(symbol);
    if (position) {
      position.currentPrice = price;
      position.unrealizedPnL =
        position.type === 'LONG'
          ? (price - position.entryPrice) * position.quantity
          : (position.entryPrice - price) * position.quantity;

      if (!(await this.riskManagementService.validatePosition(position))) {
        await this.closePosition(position);
      }
    }
  }

  /**
   * @param {Position} position
   * @returns {Promise<void>}
   */
  async closePosition(position) {
    const order = {
      symbol: position.symbol,
      type: position.type === 'LONG' ? 'SELL' : 'BUY',
      price: position.currentPrice,
      quantity: position.quantity,
    };

    await this.executeOrder(order);
    this.emit('positionClosed', position);
  }

  /**
   * @returns {Array<Position>}
   */
  getPositions() {
    return Array.from(this.positions.values());
  }

  /**
   * @param {string} symbol
   * @returns {Position | undefined}
   */
  getPosition(symbol) {
    return this.positions.get(symbol);
  }
}

module.exports = TradingEngine;
