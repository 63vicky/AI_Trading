import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BacktestConfig, BacktestResult } from '@/types/backtest';
import { Calendar } from './ui/calendar';

interface BacktestProps {
  strategyId: string;
  onRunBacktest: (config: BacktestConfig) => Promise<BacktestResult>;
}

export function Backtest({ strategyId, onRunBacktest }: BacktestProps) {
  const [config, setConfig] = useState<BacktestConfig>({
    strategyId,
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    initialCapital: 100000,
    commission: 0.001,
    slippage: 0.0001,
    parameters: {},
  });

  const [result, setResult] = useState<BacktestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunBacktest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const backtestResult = await onRunBacktest(config);
      setResult(backtestResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run backtest');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backtest Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Calendar
                selected={new Date(config.startDate)}
                onSelect={(date: Date) =>
                  setConfig({
                    ...config,
                    startDate: date.toISOString().split('T')[0],
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Calendar
                selected={new Date(config.endDate)}
                onSelect={(date: Date) =>
                  setConfig({
                    ...config,
                    endDate: date.toISOString().split('T')[0],
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Initial Capital</Label>
              <Input
                type="number"
                value={config.initialCapital}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    initialCapital: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Commission ({formatPercentage(config.commission)})</Label>
              <Slider
                value={[config.commission * 100]}
                onValueChange={([value]) =>
                  setConfig({ ...config, commission: value / 100 })
                }
                min={0}
                max={1}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <Label>Slippage ({formatPercentage(config.slippage)})</Label>
              <Slider
                value={[config.slippage * 100]}
                onValueChange={([value]) =>
                  setConfig({ ...config, slippage: value / 100 })
                }
                min={0}
                max={0.5}
                step={0.01}
              />
            </div>
          </div>

          <Button
            onClick={handleRunBacktest}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Running Backtest...' : 'Run Backtest'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Total Return</Label>
                  <div className="text-2xl font-bold">
                    {formatPercentage(result.totalReturn)}
                  </div>
                </div>
                <div>
                  <Label>Annualized Return</Label>
                  <div className="text-2xl font-bold">
                    {formatPercentage(result.annualizedReturn)}
                  </div>
                </div>
                <div>
                  <Label>Sharpe Ratio</Label>
                  <div className="text-2xl font-bold">
                    {result.sharpeRatio.toFixed(2)}
                  </div>
                </div>
                <div>
                  <Label>Max Drawdown</Label>
                  <div className="text-2xl font-bold text-red-500">
                    {formatPercentage(result.maxDrawdown)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drawdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.drawdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="drawdown"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Date</th>
                      <th className="text-left">Symbol</th>
                      <th className="text-left">Side</th>
                      <th className="text-left">Price</th>
                      <th className="text-left">Size</th>
                      <th className="text-left">PnL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trades.slice(0, 10).map((trade) => (
                      <tr key={trade.id}>
                        <td>
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                        <td>{trade.symbol}</td>
                        <td>{trade.side}</td>
                        <td>{formatCurrency(trade.price)}</td>
                        <td>{trade.size}</td>
                        <td
                          className={
                            trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                          }
                        >
                          {formatCurrency(trade.pnl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
