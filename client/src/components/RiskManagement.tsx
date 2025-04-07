import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RiskParameters } from '@/types/dashboard';

interface RiskManagementProps {
  onUpdate: (riskParams: RiskParameters) => void;
  currentRiskParams: RiskParameters;
}

export function RiskManagement({
  onUpdate,
  currentRiskParams,
}: RiskManagementProps) {
  const [riskParams, setRiskParams] =
    useState<RiskParameters>(currentRiskParams);

  const handleUpdate = () => {
    onUpdate(riskParams);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const handleSliderChange = (value: number[], key: keyof RiskParameters) => {
    if (key === 'maxDrawdown' || key === 'stopLoss' || key === 'takeProfit') {
      setRiskParams((prev) => ({
        ...prev,
        [key]: value[0] / 100,
      }));
    } else {
      setRiskParams((prev) => ({
        ...prev,
        [key]: value[0],
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Management Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Circuit Breaker</Label>
              <Switch
                checked={riskParams.circuitBreaker}
                onCheckedChange={(checked) =>
                  setRiskParams({ ...riskParams, circuitBreaker: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Max Drawdown ({formatPercentage(riskParams.maxDrawdown)})
              </Label>
              <Slider
                value={[riskParams.maxDrawdown * 100]}
                onValueChange={(value) =>
                  handleSliderChange(value, 'maxDrawdown')
                }
                min={1}
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Position Size ({riskParams.maxPositionSize})</Label>
              <Slider
                value={[riskParams.maxPositionSize]}
                onValueChange={(value) =>
                  handleSliderChange(value, 'maxPositionSize')
                }
                min={1}
                max={1000}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Leverage ({riskParams.maxLeverage}x)</Label>
              <Slider
                value={[riskParams.maxLeverage]}
                onValueChange={(value) =>
                  handleSliderChange(value, 'maxLeverage')
                }
                min={1}
                max={10}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label>Stop Loss ({formatPercentage(riskParams.stopLoss)})</Label>
              <Slider
                value={[riskParams.stopLoss * 100]}
                onValueChange={(value) => handleSliderChange(value, 'stopLoss')}
                min={1}
                max={20}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Take Profit ({formatPercentage(riskParams.takeProfit)})
              </Label>
              <Slider
                value={[riskParams.takeProfit * 100]}
                onValueChange={(value) =>
                  handleSliderChange(value, 'takeProfit')
                }
                min={1}
                max={50}
                step={0.5}
              />
            </div>
          </div>

          <Button onClick={handleUpdate} className="w-full">
            Update Risk Parameters
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Current Exposure</Label>
              <div className="text-2xl font-bold">
                {formatPercentage(riskParams.currentExposure)}
              </div>
            </div>
            <div>
              <Label>Value at Risk (VaR)</Label>
              <div className="text-2xl font-bold">
                {formatPercentage(riskParams.var)}
              </div>
            </div>
            <div>
              <Label>Portfolio Beta</Label>
              <div className="text-2xl font-bold">
                {riskParams.beta.toFixed(2)}
              </div>
            </div>
            <div>
              <Label>Volatility</Label>
              <div className="text-2xl font-bold">
                {formatPercentage(riskParams.volatility)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
