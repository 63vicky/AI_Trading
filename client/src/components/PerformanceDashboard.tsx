import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { PerformanceData } from '@/types/dashboard';

interface PerformanceDashboardProps {
  performanceData: PerformanceData | null;
}

export function PerformanceDashboard({
  performanceData,
}: PerformanceDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData?.metrics?.returns?.total?.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData?.metrics?.risk?.sharpeRatio?.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {performanceData?.metrics?.risk?.maxDrawdown?.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData?.metrics?.trading?.winRate?.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="equity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="equity">Equity Curve</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="equity">
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData?.equityCurve}>
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
        </TabsContent>

        <TabsContent value="drawdown">
          <Card>
            <CardHeader>
              <CardTitle>Drawdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData?.drawdown}>
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
        </TabsContent>

        <TabsContent value="trades">
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
                    {performanceData?.recentTrades?.map((trade) => (
                      <tr key={trade.id}>
                        <td>
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                        <td>{trade.symbol}</td>
                        <td>{trade.side}</td>
                        <td>{trade.price.toFixed(2)}</td>
                        <td>{trade.size}</td>
                        <td
                          className={
                            trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                          }
                        >
                          {trade.pnl.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
