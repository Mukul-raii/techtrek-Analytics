import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import type {
  EnhancedAnalyticsData,
  MomentumKPI,
  FreshnessKPI,
  EngagementKPI,
  VelocityLeadersKPI,
  VelocityLeader,
} from "@/types/enhancedAnalytics";

interface EnhancedDashboardMetrics {
  momentum: MomentumKPI;
  freshness: FreshnessKPI;
  engagement: EngagementKPI;
  velocityLeaders: VelocityLeadersKPI;
  isLoading: boolean;
  error: string | null;
}

export function useEnhancedMetrics(
  timeRange: string = "month",
  includeComparison: boolean = true
) {
  const [metrics, setMetrics] = useState<EnhancedDashboardMetrics | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      try {
        const response = await apiClient.get("/api/analytics", {
          params: {
            range: timeRange,
            compare: includeComparison ? "true" : "false",
          },
        });

        if (!isMounted) return;

        const data = (response as { data: { data: EnhancedAnalyticsData } })
          .data.data;

        const dashboardMetrics: EnhancedDashboardMetrics = {
          momentum: {
            score: data.metrics.healthScore.score || 0,
            change: data.comparison ? data.comparison.change.itemsPercent : 0,
            trend:
              data.comparison && data.comparison.change.itemsPercent > 0
                ? "up"
                : data.comparison && data.comparison.change.itemsPercent < 0
                ? "down"
                : "stable",
          },
          freshness: {
            percentage: data.metrics.freshnessIndex || 0,
            change: 0,
            breakdown: {
              fresh: Math.floor((data.metrics.freshnessIndex / 100) * 70),
              mixed: Math.floor((data.metrics.freshnessIndex / 100) * 20),
              stale: Math.floor((data.metrics.freshnessIndex / 100) * 10),
            },
          },
          engagement: {
            score: data.metrics.healthScore.components.engagement || 0,
            change: 0,
            trend: "stable",
            avgAcrossSources: {
              github: data.githubStats.avgStars
                ? Math.min(10, data.githubStats.avgStars / 10000)
                : 0,
              hackernews: data.hackerNewsStats.avgPoints
                ? Math.min(10, data.hackerNewsStats.avgPoints / 100)
                : 0,
            },
          },
          velocityLeaders: {
            leaders: data.metrics.velocityLeaders.map(
              (leader: VelocityLeader) => ({
                title: leader.title,
                source: leader.source,
                growthPercent: leader.growthRate,
                badge: leader.badge,
              })
            ),
          },
          isLoading: false,
          error: null,
        };

        setMetrics(dashboardMetrics);
      } catch (err) {
        if (!isMounted) return;

        console.error("Error fetching enhanced metrics:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch metrics";
        setMetrics({
          momentum: { score: 0, change: 0, trend: "stable" },
          freshness: {
            percentage: 0,
            change: 0,
            breakdown: { fresh: 0, mixed: 0, stale: 0 },
          },
          engagement: {
            score: 0,
            change: 0,
            trend: "stable",
            avgAcrossSources: { github: 0, hackernews: 0 },
          },
          velocityLeaders: { leaders: [] },
          isLoading: false,
          error: errorMessage,
        });
      }
    };

    fetchMetrics();

    return () => {
      isMounted = false;
    };
  }, [timeRange, includeComparison]);

  return metrics;
}

export function useRealGrowthMetrics(timeRange: string = "month") {
  const [growthData, setGrowthData] = useState<{
    totalGrowth: number;
    starsGrowth: number;
    pointsGrowth: number;
    comparison: {
      current: number;
      previous: number;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchGrowthData = async () => {
      try {
        const response = await apiClient.get("/api/analytics", {
          params: { range: timeRange, compare: "true" },
        });

        if (!isMounted) return;

        const data = (response as { data: { data: EnhancedAnalyticsData } })
          .data.data;

        if (data.comparison) {
          setGrowthData({
            totalGrowth: data.comparison.change.itemsPercent,
            starsGrowth: data.comparison.change.starsPercent,
            pointsGrowth: data.comparison.change.pointsPercent,
            comparison: {
              current: data.comparison.current.items,
              previous: data.comparison.previous.items,
            },
          });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching growth metrics:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchGrowthData();

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  return { growthData, isLoading };
}

export function useLanguageGrowthAnalysis(timeRange: string = "month") {
  const [languageGrowth, setLanguageGrowth] = useState<
    EnhancedAnalyticsData["languageGrowth"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLanguageGrowth = async () => {
      try {
        const response = await apiClient.get("/api/analytics", {
          params: { range: timeRange, compare: "true" },
        });

        if (!isMounted) return;

        const data = (response as { data: { data: EnhancedAnalyticsData } })
          .data.data;
        setLanguageGrowth(data.languageGrowth || null);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching language growth:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLanguageGrowth();

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  return { languageGrowth, isLoading };
}
