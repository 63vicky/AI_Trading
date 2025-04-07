/**
 * @typedef {Object} BacktestResult
 * @property {string} strategyId
 * @property {string} symbol
 * @property {string} timeframe
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} initialCapital
 * @property {number} finalCapital
 * @property {number} totalReturn
 * @property {number} annualizedReturn
 * @property {number} maxDrawdown
 * @property {number} sharpeRatio
 * @property {number} sortinoRatio
 * @property {Array<Trade>} trades
 * @property {Array<EquityPoint>} equityCurve
 * @property {Array<DrawdownPoint>} drawdown
 */

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
 * @typedef {Object} EquityPoint
 * @property {string} date
 * @property {number} equity
 * @property {number} returns
 * @property {number} drawdown
 * @property {number} peak
 * @property {number} trough
 */

/**
 * @typedef {Object} DrawdownPoint
 * @property {string} date
 * @property {number} drawdown
 * @property {number} peak
 * @property {number} trough
 */

module.exports = {
  BacktestResult: /** @type {BacktestResult} */ ({}),
  Trade: /** @type {Trade} */ ({}),
  EquityPoint: /** @type {EquityPoint} */ ({}),
  DrawdownPoint: /** @type {DrawdownPoint} */ ({}),
};
