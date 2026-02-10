import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { trendingService } from '@/services/trendingService';

export function useTrending() {
  const { trending, setTrendingData, setTrendingFilters } = useAppStore();

  const fetchTrending = useCallback(async () => {
    try {
      console.log('[useTrending] Starting fetch with filters:', trending.filters);
      setTrendingData({ isLoading: true, error: null });
      
      const data = await trendingService.getTrending(trending.filters);
      
      console.log('[useTrending] Fetch successful:', {
        repositories: data.repositories.length,
        stories: data.stories.length,
      });
      
      setTrendingData({
        repositories: data.repositories,
        stories: data.stories,
        isLoading: false,
      });
    } catch (error) {
      console.error('[useTrending] Fetch failed:', error);
      setTrendingData({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trending data',
      });
    }
  }, [trending.filters, setTrendingData]);

  const updateFilters = useCallback((filters: Partial<typeof trending.filters>) => {
    console.log('[useTrending] Updating filters:', filters);
    setTrendingFilters(filters);
  }, [setTrendingFilters]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    console.log('[useTrending] useEffect triggered');
    fetchTrending();
  }, [fetchTrending]);

  return {
    ...trending,
    updateFilters,
    refetch: fetchTrending,
  };
}
