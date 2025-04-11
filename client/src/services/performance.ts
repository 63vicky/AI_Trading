import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class PerformanceService {
  private static instance: PerformanceService;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  private async fetchWithCache(url: string, options: RequestInit = {}) {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: now });
    return data;
  }

  public async getStrategyPerformance(strategyId: string) {
    return this.fetchWithCache(
      `${API_URL}/api/performance/strategy/${strategyId}`
    );
  }

  public async getAllStrategiesPerformance() {
    const token = localStorage.getItem('token');
    return this.fetchWithCache(`${API_URL}/api/performance/strategies`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  public async getPeriodPerformance(startDate: string, endDate: string) {
    return this.fetchWithCache(
      `${API_URL}/api/performance/period/${startDate}/${endDate}`
    );
  }

  public clearCache() {
    this.cache.clear();
  }
}

export const usePerformanceService = () => {
  const { user, loading: authLoading } = useAuth();
  const service = PerformanceService.getInstance();

  const getStrategyPerformance = async (strategyId: string) => {
    if (!user) {
      throw new Error(
        'You are not logged in! Please log in to get access to performance data.'
      );
    }
    return service.getStrategyPerformance(strategyId);
  };

  const getAllStrategiesPerformance = async () => {
    if (!user) {
      throw new Error(
        'You are not logged in! Please log in to get access to performance data.'
      );
    }
    return service.getAllStrategiesPerformance();
  };

  const getPeriodPerformance = async (startDate: string, endDate: string) => {
    if (!user) {
      throw new Error(
        'You are not logged in! Please log in to get access to performance data.'
      );
    }
    return service.getPeriodPerformance(startDate, endDate);
  };

  return {
    getStrategyPerformance,
    getAllStrategiesPerformance,
    getPeriodPerformance,
    authLoading,
  };
};
