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
import { LiveData } from '@/types/dashboard';

interface RealTimeMonitorProps {
  liveData: LiveData | null;
}

export function RealTimeMonitor({ liveData }: RealTimeMonitorProps) {
  const formatNumber = (value: number | undefined) => {
    if (value === undefined) return '0.00';
    return value.toFixed(2);
  };

  const getPnLClass = (value: number | undefined) => {
    if (value === undefined) return '';
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Active Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {liveData?.activeStrategies || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Open Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {liveData?.openPositions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Today&apos;s PnL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getPnLClass(
                liveData?.todayPnL
              )}`}
            >
              {formatNumber(liveData?.todayPnL)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(liveData?.totalExposure)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Current Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Symbol</th>
                      <th className="text-left">Size</th>
                      <th className="text-left">Entry Price</th>
                      <th className="text-left">Current Price</th>
                      <th className="text-left">PnL</th>
                      <th className="text-left">Strategy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveData?.positions?.map((position) => (
                      <tr key={position.id}>
                        <td>{position.symbol}</td>
                        <td>{position.size}</td>
                        <td>{position.entryPrice.toFixed(2)}</td>
                        <td>{position.currentPrice.toFixed(2)}</td>
                        <td
                          className={
                            position.pnl >= 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          }
                        >
                          {position.pnl.toFixed(2)}%
                        </td>
                        <td>{position.strategy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Time</th>
                      <th className="text-left">Symbol</th>
                      <th className="text-left">Side</th>
                      <th className="text-left">Type</th>
                      <th className="text-left">Price</th>
                      <th className="text-left">Size</th>
                      <th className="text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveData?.orders?.map((order) => (
                      <tr key={order.id}>
                        <td>
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </td>
                        <td>{order.symbol}</td>
                        <td>{order.side}</td>
                        <td>{order.type}</td>
                        <td>{order.price?.toFixed(2)}</td>
                        <td>{order.size}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveData?.marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="volume" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
