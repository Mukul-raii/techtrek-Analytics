import { useEffect, useState, useCallback } from "react";
import { analyticsService } from "@/services/analyticsService";
import { trendingService } from "@/services/trendingService";

interface DashboardMetrics {
  totalRepositories: {
    value: string;
    change: number;
    trend: "up" | "down" | "stable";
  };
  activeStories: {
    value: string;
    change: number;
    trend: "up" | "down" | "stable";
  };
  topLanguages: {
    value: string;
    change: number;
    trend: "up" | "down" | "stable";
  };
  avgStars: {
    value: string;
    change: number;
    trend: "up" | "down" | "stable";
  };
}

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch both GitHub and HackerNews analytics
      const [githubData, hackerNewsData, trendingData] = await Promise.all([
        analyticsService.getSourceAnalytics('github', 'month').catch(() => null),
        analyticsService.getSourceAnalytics('hackernews', 'month').catch(() => null),
        trendingService.getTrending({
          source: "all",
          dateRange: "today",
          sortBy: "trending",
        }).catch(() => ({ repositories: [], stories: [] })),
      ]);

      const totalRepos = githubData?.totalItems || trendingData.repositories.length;
      const totalStories = hackerNewsData?.totalItems || trendingData.stories.length;
      const uniqueLanguages = githubData?.topLanguages?.length || 0;
      const avgStars = githubData?.avgStars || 0;

      const dashboardMetrics: DashboardMetrics = {
        totalRepositories: {
          value: formatNumber(totalRepos),
          change: 12.5,
          trend: "up",
        },
        activeStories: {
          value: formatNumber(totalStories),
          change: 8.2,
          trend: "up",
        },
        topLanguages: {
          value: uniqueLanguages.toString(),
          change: uniqueLanguages > 20 ? 5 : -2.1,
          trend: uniqueLanguages > 20 ? "up" : "down",
        },
        avgStars: {
          value: formatNumber(avgStars),
          change: 5.7,
          trend: "up",
        },
      };

      setMetrics(dashboardMetrics);
    } catch (err) {
      console.error("[useDashboard] Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );

      // Set fallback metrics on error
      setMetrics({
        totalRepositories: { value: "0", change: 0, trend: "stable" },
        activeStories: { value: "0", change: 0, trend: "stable" },
        topLanguages: { value: "0", change: 0, trend: "stable" },
        avgStars: { value: "0", change: 0, trend: "stable" },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
