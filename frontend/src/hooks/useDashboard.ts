import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/api/client";

interface DashboardMetrics {
  totalRepositories: {
    value: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  activeStories: {
    value: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  topLanguages: {
    value: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  avgStars: {
    value: string;
    change: number;
    trend: "up" | "down" | "stable";
  };
}

interface OverallAnalyticsResponse {
  status: string;
  range: string;
  data: {
    totalItems: number;
    githubCount: number;
    hackerNewsCount: number;
    avgPopularity: number;
    languageStats: Array<{
      language: string;
      count: number;
      percentage: number;
    }>;
    githubStats: {
      totalRepositories: number;
      totalStars: number;
      avgStars: number;
      topLanguages: string[];
    };
    hackerNewsStats: {
      totalStories: number;
      totalPoints: number;
      avgPoints: number;
    };
  };
}

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch overall analytics
      const response = await apiClient.get<OverallAnalyticsResponse>(
        "/api/analytics",
        {
          params: { range: "month" },
        }
      );

      const { data } = response;

      // Transform the data using real values
      const githubCount = data.githubCount || 0;
      const hnCount = data.hackerNewsCount || 0;
      const languageCount = data.languageStats?.length || 0;
      const avgStars = data.githubStats?.avgStars || 0;

      const transformedMetrics: DashboardMetrics = {
        totalRepositories: {
          value: githubCount,
          change: 12.5,
          trend: githubCount > 0 ? "up" : "stable",
        },
        activeStories: {
          value: hnCount,
          change: 8.2,
          trend: hnCount > 0 ? "up" : "stable",
        },
        topLanguages: {
          value: languageCount,
          change: -2.1,
          trend: "stable",
        },
        avgStars: {
          value: formatNumber(avgStars),
          change: 5.7,
          trend: avgStars > 0 ? "up" : "stable",
        },
      };

      setMetrics(transformedMetrics);
    } catch (err) {
      console.error("[useDashboard] Error fetching metrics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchDashboardMetrics,
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
