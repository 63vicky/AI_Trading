const { EventEmitter } = require('events');
const marketTypes = require('../types/market');

/**
 * @typedef {Object} OrderBook
 * @property {Array<{price: number, quantity: number}>} bids
 * @property {Array<{price: number, quantity: number}>} asks
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
 * @typedef {Object} Trade
 * @property {string} id
 * @property {string} timestamp
 * @property {string} symbol
 * @property {string} type
 * @property {number} price
 * @property {number} quantity
 */

class MarketDataService extends EventEmitter {
  constructor() {
    super();
    this.marketData = new Map();
    this.orderBooks = new Map();
    this.trades = new Map();
  }

  /**
   * @param {string} symbol
   * @param {string} timeframe
   * @returns {Promise<MarketData>}
   */
  async getMarketData(symbol, timeframe) {
    const key = `${symbol}_${timeframe}`;
    if (!this.marketData.has(key)) {
      throw new Error(`Market data not found for ${key}`);
    }
    return this.marketData.get(key);
  }

  /**
   * @param {string} symbol
   * @param {string} timeframe
   * @returns {Promise<OrderBook>}
   */
  async getOrderBook(symbol, timeframe) {
    const key = `${symbol}_${timeframe}`;
    if (!this.orderBooks.has(key)) {
      throw new Error(`Order book not found for ${key}`);
    }
    return this.orderBooks.get(key);
  }

  /**
   * @param {string} symbol
   * @param {string} timeframe
   * @returns {Promise<Array<Trade>>}
   */
  async getTrades(symbol, timeframe) {
    const key = `${symbol}_${timeframe}`;
    if (!this.trades.has(key)) {
      throw new Error(`Trades not found for ${key}`);
    }
    return this.trades.get(key);
  }

  /**
   * @param {MarketData} data
   */
  updateMarketData(data) {
    const key = `${data.symbol}_${data.timeframe}`;
    this.marketData.set(key, data);
    this.emit('marketData', data);
  }

  /**
   * @param {string} symbol
   * @param {string} timeframe
   * @param {OrderBook} orderBook
   */
  updateOrderBook(symbol, timeframe, orderBook) {
    const key = `${symbol}_${timeframe}`;
    this.orderBooks.set(key, orderBook);
    this.emit('orderBook', { symbol, timeframe, orderBook });
  }

  /**
   * @param {Trade} trade
   */
  addTrade(trade) {
    const key = `${trade.symbol}_${trade.timeframe}`;
    if (!this.trades.has(key)) {
      this.trades.set(key, []);
    }
    this.trades.get(key).push(trade);
    this.emit('trade', trade);
  }

  /**
   * @param {string} symbol
   * @param {string} timeframe
   * @param {function(MarketData): void} callback
   */
  subscribeMarketData(symbol, timeframe, callback) {
    this.on('marketData', (data) => {
      if (data.symbol === symbol && data.timeframe === timeframe) {
        callback(data);
      }
    });
  }

  /**
   * @param {string} symbol
   * @param {string} timeframe
   * @param {function(OrderBook): void} callback
   */
  subscribeOrderBook(symbol, timeframe, callback) {
    this.on('orderBook', ({ symbol: s, timeframe: t, orderBook }) => {
      if (s === symbol && t === timeframe) {
        callback(orderBook);
      }
    });
  }

  /**
   * @param {string} symbol
   * @param {string} timeframe
   * @param {function(Trade): void} callback
   */
  subscribeTrades(symbol, timeframe, callback) {
    this.on('trade', (trade) => {
      if (trade.symbol === symbol && trade.timeframe === timeframe) {
        callback(trade);
      }
    });
  }
}

module.exports = MarketDataService;
