'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StrategyConfig } from '@/components/StrategyConfig';
import { PerformanceDashboard } from '@/components/PerformanceDashboard';
import { RiskManagement } from '@/components/RiskManagement';
import { RealTimeMonitor } from '@/components/RealTimeMonitor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePerformanceService } from '@/services/performance';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  LiveData,
  PerformanceData,
  RiskParameters,
  StrategyConfig as StrategyConfigType,
} from '@/types/dashboard';
import { websocketService } from '@/services/websocket';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getAllStrategiesPerformance, authLoading: performanceLoading } =
    usePerformanceService();

  const [activeTab, setActiveTab] = useState('monitor');
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [riskParams, setRiskParams] = useState<RiskParameters>({
    circuitBreaker: true,
    maxDrawdown: 0.1,
    maxPositionSize: 100,
    maxLeverage: 2,
    stopLoss: 0.05,
    takeProfit: 0.1,
    currentExposure: 0,
    var: 0,
    beta: 0,
    volatility: 0,
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const fetchPerformanceData = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);
      const data = await getAllStrategiesPerformance();
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch performance data'
      );
    }
  }, [user, getAllStrategiesPerformance]);
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Subscribe to live data updates
    const unsubscribeLiveData = websocketService.subscribe(
      'liveData',
      (data) => {
        if ('activeStrategies' in data) {
          setLiveData(data as LiveData);
        }
      }
    );

    // Subscribe to performance updates
    const unsubscribePerformance = websocketService.subscribe(
      'performance',
      (data) => {
        if ('totalPnL' in data) {
          setPerformanceData(data as PerformanceData);
        }
      }
    );

    // Subscribe to risk parameter updates
    const unsubscribeRisk = websocketService.subscribe('risk', (data) => {
      if ('circuitBreaker' in data) {
        setRiskParams(data as RiskParameters);
      }
    });

    // Fetch initial performance data
    fetchPerformanceData();

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeLiveData();
      unsubscribePerformance();
      unsubscribeRisk();
    };
  }, [user, authLoading, router, fetchPerformanceData]);

  const handleStrategySubmit = async (config: StrategyConfigType) => {
    if (!user) return;

    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/strategies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create strategy');
      }

      // Send strategy update through WebSocket
      websocketService.send({
        type: 'strategyUpdate',
        data: config,
      });
      toast.success('Strategy created successfully');

      // Refresh performance data
      await fetchPerformanceData();
    } catch (error) {
      console.error('Error creating strategy:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create strategy'
      );
    }
  };

  const handleRiskUpdate = async (params: RiskParameters) => {
    if (!user) return;

    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/risk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update risk parameters');
      }

      // Send risk update through WebSocket
      websocketService.send({
        type: 'riskUpdate',
        data: params,
      });

      setRiskParams(params);
    } catch (error) {
      console.error('Error updating risk parameters:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update risk parameters'
      );
    }
  };

  if (authLoading || performanceLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Config</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor">
          <RealTimeMonitor liveData={liveData} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceDashboard performanceData={performanceData} />
        </TabsContent>

        <TabsContent value="strategy">
          <StrategyConfig onSubmit={handleStrategySubmit} />
        </TabsContent>

        <TabsContent value="risk">
          <RiskManagement
            onUpdate={handleRiskUpdate}
            currentRiskParams={riskParams}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
