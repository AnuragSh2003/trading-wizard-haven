import { useState, useEffect } from 'react';
import { zerodhaApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ZerodhaData {
  holdings: any[];
  positions: any[];
  profile: any;
  portfolioValue: number;
  todaysPnL: number;
}

export const useZerodhaData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ZerodhaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZerodhaData = async () => {
    if (!user?.isZerodhaLinked) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [holdings, positions, profile] = await Promise.all([
        zerodhaApi.getHoldings(),
        zerodhaApi.getPositions(),
        zerodhaApi.getProfile(),
      ]);

      // Calculate portfolio value and P&L
      const portfolioValue = holdings.reduce((total: number, holding: any) => 
        total + (holding.quantity * holding.last_price), 0);

      const todaysPnL = [...holdings, ...positions].reduce((total: number, item: any) => 
        total + (item.pnl || 0), 0);

      setData({
        holdings,
        positions,
        profile,
        portfolioValue,
        todaysPnL,
      });
    } catch (err: any) {
      console.error('Error fetching Zerodha data:', err);
      setError(err.message || 'Failed to fetch Zerodha data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZerodhaData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchZerodhaData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.isZerodhaLinked]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchZerodhaData,
  };
};
