import { useEffect, useState, useCallback } from "react";
import { analyticsService } from "@/services/analyticsService";

interface GrowthMetricsData {
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
  itemsToday: number;
  itemsYesterday: number;
  itemChange: number;
  metrics?: Array<{
    date: string;
    source: string;
    item_count: number;
    popularity_score: number;
  }>;
}

interface UseGrowthMetricsReturn {
  data: GrowthMetricsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGrowthMetrics(
  source: "github" | "hackernews" = "github",
  days: number = 7
): UseGrowthMetricsReturn {
  const [data, setData] = useState<GrowthMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrowthMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await analyticsService.getGrowthMetrics(source, days);
      setData(response);
    } catch (err) {
      console.error("Error fetching growth metrics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch growth metrics"
      );
    } finally {
      setIsLoading(false);
    }
  }, [source, days]);

  useEffect(() => {
    fetchGrowthMetrics();
  }, [fetchGrowthMetrics]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchGrowthMetrics,
  };
}
