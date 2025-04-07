const types = require('../types/backtest.js');

/** @type {import('../types/backtest').Trade} */
const Trade = types.Trade;

/** @type {import('../types/backtest').EquityPoint} */
const EquityPoint = types.EquityPoint;

/** @type {import('../types/backtest').DrawdownPoint} */
const DrawdownPoint = types.DrawdownPoint;

/**
 * @typedef {Object} Metrics
 * @property {number} totalTrades
 * @property {number} winningTrades
 * @property {number} losingTrades
 * @property {number} winRate
 * @property {number} averageWin
 * @property {number} averageLoss
 * @property {number} profitFactor
 * @property {number} maxDrawdown
 * @property {number} sharpeRatio
 * @property {number} sortinoRatio
 * @property {Array<typeof EquityPoint>} equityCurve
 * @property {Array<typeof DrawdownPoint>} drawdown
 */

/**
 * @param {Array<typeof Trade>} trades
 * @param {number} initialCapital
 * @returns {Metrics}
 */
function calculateMetrics(trades, initialCapital) {
  // Group trades by day
  const dailyTrades = trades.reduce(
    /**
     * @param {Record<string, Array<typeof Trade>>} acc
     * @param {typeof Trade} trade
     * @returns {Record<string, Array<typeof Trade>>}
     */
    (acc, trade) => {
      const date = trade.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trade);
      return acc;
    },
    {}
  );

  // Calculate metrics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(
    /**
     * @param {typeof Trade} t
     * @returns {boolean}
     */
    (t) => t.pnl > 0
  ).length;
  const losingTrades = totalTrades - winningTrades;
  const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0;

  const winningPnLs = trades
    .filter(
      /**
       * @param {typeof Trade} t
       * @returns {boolean}
       */
      (t) => t.pnl > 0
    )
    .map(
      /**
       * @param {typeof Trade} t
       * @returns {number}
       */
      (t) => t.pnl
    );
  const losingPnLs = trades
    .filter(
      /**
       * @param {typeof Trade} t
       * @returns {boolean}
       */
      (t) => t.pnl < 0
    )
    .map(
      /**
       * @param {typeof Trade} t
       * @returns {number}
       */
      (t) => t.pnl
    );

  const averageWin =
    winningPnLs.length > 0
      ? winningPnLs.reduce(
          /**
           * @param {number} a
           * @param {number} b
           * @returns {number}
           */
          (a, b) => a + b,
          0
        ) / winningPnLs.length
      : 0;
  const averageLoss =
    losingPnLs.length > 0
      ? Math.abs(
          losingPnLs.reduce(
            /**
             * @param {number} a
             * @param {number} b
             * @returns {number}
             */
            (a, b) => a + b,
            0
          )
        ) / losingPnLs.length
      : 0;

  const totalProfit = winningPnLs.reduce(
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    (a, b) => a + b,
    0
  );
  const totalLoss = Math.abs(
    losingPnLs.reduce(
      /**
       * @param {number} a
       * @param {number} b
       * @returns {number}
       */
      (a, b) => a + b,
      0
    )
  );
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;

  // Calculate equity curve and drawdown
  const equityCurve = calculateEquityCurve(trades);
  const maxDrawdown = Math.max(...equityCurve.map((point) => point.drawdown));

  // Calculate risk-adjusted returns
  const returns = equityCurve.map((point) => point.returns);
  const sharpeRatio = calculateSharpeRatio(returns);
  const sortinoRatio = calculateSortinoRatio(returns);

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    averageWin,
    averageLoss,
    profitFactor,
    maxDrawdown,
    sharpeRatio,
    sortinoRatio,
    equityCurve,
    drawdown: equityCurve.map((point) => ({
      date: point.date,
      drawdown: point.drawdown,
      peak: point.peak,
      trough: point.trough,
    })),
  };
}

/**
 * @param {Array<typeof Trade>} trades
 * @returns {Array<typeof EquityPoint>}
 */
function calculateEquityCurve(trades) {
  // Group trades by day
  const dailyTrades = trades.reduce(
    /**
     * @param {Record<string, Array<typeof Trade>>} acc
     * @param {typeof Trade} trade
     * @returns {Record<string, Array<typeof Trade>>}
     */
    (acc, trade) => {
      const date = trade.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trade);
      return acc;
    },
    {}
  );

  // Calculate equity curve
  const equityCurve = [];
  let currentCapital = 0;
  let peakCapital = 0;
  let maxDrawdown = 0;

  // Calculate daily returns and equity
  Object.entries(dailyTrades).forEach(([date, dailyTrades]) => {
    const dailyPnL = dailyTrades.reduce(
      /**
       * @param {number} sum
       * @param {typeof Trade} trade
       * @returns {number}
       */
      (sum, trade) => sum + trade.pnl,
      0
    );
    currentCapital += dailyPnL;
    peakCapital = Math.max(peakCapital, currentCapital);
    const drawdown = (peakCapital - currentCapital) / peakCapital;
    maxDrawdown = Math.max(maxDrawdown, drawdown);

    equityCurve.push({
      date,
      equity: currentCapital,
      returns: dailyPnL / (currentCapital - dailyPnL),
      drawdown,
      peak: peakCapital,
      trough: currentCapital,
    });
  });

  return equityCurve;
}

/**
 * @param {number[]} returns
 * @returns {number}
 */
function calculateSharpeRatio(returns) {
  if (returns.length === 0) return 0;

  const meanReturn =
    returns.reduce(
      /**
       * @param {number} sum
       * @param {number} r
       * @returns {number}
       */
      (sum, r) => sum + r,
      0
    ) / returns.length;
  const variance =
    returns.reduce(
      /**
       * @param {number} sum
       * @param {number} r
       * @returns {number}
       */
      (sum, r) => sum + Math.pow(r - meanReturn, 2),
      0
    ) / returns.length;
  const volatility = Math.sqrt(variance * 252); // Annualized volatility

  // Assuming 2% risk-free rate
  const riskFreeRate = 0.02;
  const annualizedReturn = Math.pow(1 + meanReturn, 252) - 1;

  return volatility > 0 ? (annualizedReturn - riskFreeRate) / volatility : 0;
}

/**
 * @param {number[]} returns
 * @returns {number}
 */
function calculateSortinoRatio(returns) {
  if (returns.length === 0) return 0;

  const meanReturn =
    returns.reduce(
      /**
       * @param {number} sum
       * @param {number} r
       * @returns {number}
       */
      (sum, r) => sum + r,
      0
    ) / returns.length;
  const downsideReturns = returns.filter(
    /**
     * @param {number} r
     * @returns {boolean}
     */
    (r) => r < 0
  );
  const downsideVariance =
    downsideReturns.reduce(
      /**
       * @param {number} sum
       * @param {number} r
       * @returns {number}
       */
      (sum, r) => sum + Math.pow(r, 2),
      0
    ) / returns.length;
  const downsideVolatility = Math.sqrt(downsideVariance * 252); // Annualized downside volatility

  // Assuming 2% risk-free rate
  const riskFreeRate = 0.02;
  const annualizedReturn = Math.pow(1 + meanReturn, 252) - 1;

  return downsideVolatility > 0
    ? (annualizedReturn - riskFreeRate) / downsideVolatility
    : 0;
}

module.exports = {
  calculateMetrics,
  calculateEquityCurve,
  calculateSharpeRatio,
  calculateSortinoRatio,
};
