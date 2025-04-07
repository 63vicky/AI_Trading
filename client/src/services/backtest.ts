import { BacktestConfig, BacktestResult } from '@/types/backtest';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export async function runBacktest(
  config: BacktestConfig
): Promise<BacktestResult> {
  const response = await fetch(`${API_BASE_URL}/backtest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to run backtest');
  }

  return response.json();
}

export async function getBacktestHistory(): Promise<BacktestResult[]> {
  const response = await fetch(`${API_BASE_URL}/backtest/history`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch backtest history');
  }

  return response.json();
}

export async function getBacktestResult(id: string): Promise<BacktestResult> {
  const response = await fetch(`${API_BASE_URL}/backtest/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch backtest result');
  }

  return response.json();
}

export async function deleteBacktestResult(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/backtest/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete backtest result');
  }
}
