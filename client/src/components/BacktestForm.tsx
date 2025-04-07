import React, { useState } from 'react';
import { BacktestConfig } from '../types/backtest';

interface BacktestFormProps {
  onSubmit: (config: BacktestConfig) => void;
  isLoading: boolean;
}

export const BacktestForm: React.FC<BacktestFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [config, setConfig] = useState<BacktestConfig>({
    strategyId: 'sma_strategy_1',
    startDate: '',
    endDate: '',
    initialCapital: 100000,
    commission: 0.001,
    slippage: 0.0005,
    parameters: {
      symbol: 'AAPL',
      lookbackPeriod: 20,
      threshold: 0.02,
      positionSize: 0.1,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('parameters.')) {
      const paramName = name.split('.')[1];
      setConfig((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [paramName]: Number(value),
        },
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        [name]: name === 'strategyId' ? value : Number(value),
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Strategy ID
        </label>
        <input
          type="text"
          name="strategyId"
          value={config.strategyId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={config.startDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          value={config.endDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Initial Capital
        </label>
        <input
          type="number"
          name="initialCapital"
          value={config.initialCapital}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Commission (%)
        </label>
        <input
          type="number"
          name="commission"
          value={config.commission}
          onChange={handleChange}
          step="0.0001"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Slippage (%)
        </label>
        <input
          type="number"
          name="slippage"
          value={config.slippage}
          onChange={handleChange}
          step="0.0001"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Symbol
        </label>
        <input
          type="text"
          name="parameters.symbol"
          value={config.parameters.symbol}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Lookback Period
        </label>
        <input
          type="number"
          name="parameters.lookbackPeriod"
          value={config.parameters.lookbackPeriod}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Threshold (%)
        </label>
        <input
          type="number"
          name="parameters.threshold"
          value={config.parameters.threshold}
          onChange={handleChange}
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Position Size (%)
        </label>
        <input
          type="number"
          name="parameters.positionSize"
          value={config.parameters.positionSize}
          onChange={handleChange}
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Running Backtest...' : 'Run Backtest'}
      </button>
    </form>
  );
};
