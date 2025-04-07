import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const usePerformanceService = () => {
  const { user, loading: authLoading } = useAuth();

  const getStrategyPerformance = async (strategyId: string) => {
    if (!user) {
      throw new Error(
        'You are not logged in! Please log in to get access to performance data.'
      );
    }

    try {
      const response = await fetch(
        `${API_URL}/api/performance/strategy/${strategyId}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch strategy performance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching strategy performance:', error);
      throw error;
    }
  };

  const getAllStrategiesPerformance = async () => {
    if (!user) {
      throw new Error(
        'You are not logged in! Please log in to get access to performance data.'
      );
    }

    try {
      const response = await fetch(`${API_URL}/api/performance/strategies`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch strategies performance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching strategies performance:', error);
      throw error;
    }
  };

  const getPeriodPerformance = async (startDate: string, endDate: string) => {
    if (!user) {
      throw new Error(
        'You are not logged in! Please log in to get access to performance data.'
      );
    }

    try {
      const response = await fetch(
        `${API_URL}/api/performance/period/${startDate}/${endDate}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch period performance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching period performance:', error);
      throw error;
    }
  };

  return {
    getStrategyPerformance,
    getAllStrategiesPerformance,
    getPeriodPerformance,
    authLoading,
  };
};
