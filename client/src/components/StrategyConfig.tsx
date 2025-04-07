import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { StrategyConfig as StrategyConfigType } from '@/types/dashboard';

interface StrategyConfigProps {
  onSubmit: (config: StrategyConfigType) => void;
}

export function StrategyConfig({ onSubmit }: StrategyConfigProps) {
  const [config, setConfig] = useState<StrategyConfigType>({
    name: '',
    type: '',
    parameters: {
      symbol: '',
      lookbackPeriod: 20,
      threshold: 0.02,
      positionSize: 1,
    },
    riskParameters: {
      maxDrawdown: 0.1,
      maxPositionSize: 100,
      maxLeverage: 2,
      stopLoss: 0.05,
      takeProfit: 0.1,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const handleSliderChange = (
    value: number[],
    key:
      | keyof StrategyConfigType['parameters']
      | keyof StrategyConfigType['riskParameters']
  ) => {
    if (key in config.parameters || key === 'maxPositionSize') {
      setConfig((prev) => ({
        ...prev,
        riskParameters: {
          ...prev.riskParameters,
          [key]: value[0],
        },
        parameters: {
          ...prev.parameters,
          [key]: value[0],
        },
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        riskParameters: {
          ...prev.riskParameters,
          [key]: value[0] / 100,
        },
      }));
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Strategy Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Strategy Type</Label>
            <Select
              value={config.type}
              onValueChange={(value) => setConfig({ ...config, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select strategy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HFT">High-Frequency Trading</SelectItem>
                <SelectItem value="STATISTICAL_ARBITRAGE">
                  Statistical Arbitrage
                </SelectItem>
                <SelectItem value="MARKET_MAKING">Market Making</SelectItem>
                <SelectItem value="MEAN_REVERSION">Mean Reversion</SelectItem>
                <SelectItem value="TREND_FOLLOWING">Trend Following</SelectItem>
                <SelectItem value="MACHINE_LEARNING">
                  Machine Learning
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Trading Symbol</Label>
            <Input
              id="symbol"
              value={config.parameters.symbol}
              onChange={(e) =>
                setConfig({
                  ...config,
                  parameters: { ...config.parameters, symbol: e.target.value },
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>
              Lookback Period ({config.parameters.lookbackPeriod} days)
            </Label>
            <Slider
              value={[config.parameters.lookbackPeriod]}
              onValueChange={(value) =>
                handleSliderChange(value, 'lookbackPeriod')
              }
              min={1}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Risk Parameters</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  Max Drawdown (
                  {formatPercentage(config.riskParameters.maxDrawdown)})
                </Label>
                <Slider
                  value={[config.riskParameters.maxDrawdown * 100]}
                  onValueChange={(value) =>
                    handleSliderChange(value, 'maxDrawdown')
                  }
                  min={1}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <Label>
                  Max Position Size ({config.riskParameters.maxPositionSize})
                </Label>
                <Slider
                  value={[config.riskParameters.maxPositionSize]}
                  onValueChange={(value) =>
                    handleSliderChange(value, 'maxPositionSize')
                  }
                  min={1}
                  max={1000}
                  step={1}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Strategy
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
