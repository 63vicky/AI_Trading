const { EventEmitter } = require('events');
const tradingTypes = require('../types/trading');
const marketTypes = require('../types/market');

/**
 * @typedef {Object} Position
 * @property {string} symbol
 * @property {string} type
 * @property {number} quantity
 * @property {number} entryPrice
 * @property {number} currentPrice
 * @property {number} unrealizedPnL
 */

/**
 * @typedef {Object} Order
 * @property {string} symbol
 * @property {string} type
 * @property {number} price
 * @property {number} quantity
 */

/**
 * @typedef {Object} RiskConfig
 * @property {number} maxPositionSize
 * @property {number} maxDrawdown
 * @property {number} stopLoss
 * @property {number} takeProfit
 */

class RiskManagementService extends EventEmitter {
  /**
   * @param {RiskConfig} config
   */
  constructor(config) {
    super();
    this.config = config;
    this.positions = new Map();
  }

  /**
   * @param {Position} position
   * @param {Order} order
   * @returns {Promise<boolean>}
   */
  async validateOrder(position, order) {
    // Check position size
    const newPositionSize = position
      ? position.quantity + order.quantity
      : order.quantity;
    if (newPositionSize > this.config.maxPositionSize) {
      this.emit('riskViolation', {
        type: 'POSITION_SIZE',
        message: `Position size ${newPositionSize} exceeds maximum ${this.config.maxPositionSize}`,
      });
      return false;
    }

    // Check stop loss
    if (
      order.type === 'SELL' &&
      order.price < position.entryPrice * (1 - this.config.stopLoss)
    ) {
      this.emit('riskViolation', {
        type: 'STOP_LOSS',
        message: `Stop loss triggered at ${order.price}`,
      });
      return false;
    }

    // Check take profit
    if (
      order.type === 'SELL' &&
      order.price > position.entryPrice * (1 + this.config.takeProfit)
    ) {
      this.emit('riskViolation', {
        type: 'TAKE_PROFIT',
        message: `Take profit triggered at ${order.price}`,
      });
      return false;
    }

    return true;
  }

  /**
   * @param {Position} position
   * @returns {Promise<boolean>}
   */
  async validatePosition(position) {
    // Check drawdown
    const drawdown =
      (position.entryPrice - position.currentPrice) / position.entryPrice;
    if (drawdown > this.config.maxDrawdown) {
      this.emit('riskViolation', {
        type: 'DRAWDOWN',
        message: `Drawdown ${drawdown} exceeds maximum ${this.config.maxDrawdown}`,
      });
      return false;
    }

    return true;
  }

  /**
   * @param {Position} position
   */
  updatePosition(position) {
    this.positions.set(position.symbol, position);
  }

  /**
   * @param {string} symbol
   */
  removePosition(symbol) {
    this.positions.delete(symbol);
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

module.exports = RiskManagementService;
