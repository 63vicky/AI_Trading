import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBacktestHistory, deleteBacktestResult } from '@/services/backtest';
import { BacktestResult } from '@/types/backtest';
import { format } from 'date-fns';

export function BacktestHistory() {
  const [history, setHistory] = useState<BacktestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await getBacktestHistory();
      setHistory(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBacktestResult(id);
      setHistory(history.filter((result) => result.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete result');
    }
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  if (isLoading) {
    return <div>Loading history...</div>;
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardContent className="pt-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtest History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Strategy</th>
                <th className="text-left">Period</th>
                <th className="text-left">Return</th>
                <th className="text-left">Sharpe</th>
                <th className="text-left">Drawdown</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((result) => (
                <tr key={result.id}>
                  <td>{formatDate(result.startDate)}</td>
                  <td>{result.strategyId}</td>
                  <td>
                    {formatDate(result.startDate)} -{' '}
                    {formatDate(result.endDate)}
                  </td>
                  <td
                    className={
                      result.totalReturn >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {formatPercentage(result.totalReturn)}
                  </td>
                  <td>{result.sharpeRatio.toFixed(2)}</td>
                  <td className="text-red-500">
                    {formatPercentage(result.maxDrawdown)}
                  </td>
                  <td>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(result.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
