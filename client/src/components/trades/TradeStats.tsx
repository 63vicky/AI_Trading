'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalProfitLoss: number;
  averageProfitLoss: number;
  winRate: number;
  averageHoldingTime: number;
}

export function TradeStats() {
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/trades/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching trade stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return <div>Loading statistics...</div>;
  }

  if (!stats) {
    return <div>No statistics available</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTrades}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(stats.winRate)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.winningTrades} wins / {stats.losingTrades} losses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              stats.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {formatCurrency(stats.totalProfitLoss)}
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {formatCurrency(stats.averageProfitLoss)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg Holding Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(stats.averageHoldingTime)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
