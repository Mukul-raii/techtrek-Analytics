import { apiClient } from "@/api/client";
import type { LanguageStats, TrendData, MetricCard } from "@/types/analytics";

interface BackendAnalyticsResponse {
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
      stars: number;
      avgStars: number;
      percentage: number;
    }>;
    githubStats: {
      totalRepositories: number;
      totalStars: number;
      totalForks: number;
      avgStars: number;
      topLanguages: string[];
    };
    hackerNewsStats: {
      totalStories: number;
      totalPoints: number;
      totalComments: number;
      avgPoints: number;
      avgComments: number;
    };
  };
}

interface SourceAnalyticsResponse {
  status: string;
  source: string;
  range: string;
  data: {
    source: string;
    totalItems: number;
    avgStars?: number;
    avgPoints?: number;
    topLanguages: string[];
    growthTrend: string;
  };
}

class AnalyticsService {
  async getSourceAnalytics(
    source: "github" | "hackernews",
    range: "day" | "week" | "month" = "month"
  ) {
    const response = await apiClient.get<SourceAnalyticsResponse>(
      `/api/analytics/${source}`,
      { params: { range } }
    );
    return response.data;
  }

  async getAnalytics(dateRange: string = "month") {
    const response = await apiClient.get<BackendAnalyticsResponse>(
      "/api/analytics",
      {
        params: { range: dateRange },
      }
    );

    const { data } = response;

    // Transform backend data to frontend format
    const languageStats: LanguageStats[] = (data.languageStats || []).map(
      (lang) => ({
        language: lang.language,
        count: lang.count,
        percentage: lang.percentage,
        trend: "stable" as const,
      })
    );

    const metrics: MetricCard[] = [
      {
        title: "Total Items",
        value: data.totalItems || 0,
        change: 12.5,
        trend: "up",
        icon: "📊",
      },
    ];

    return {
      languageStats,
      trendData: [],
      metrics,
      rawData: data,
    };
  }

  async getLanguageStats(dateRange?: string): Promise<LanguageStats[]> {
    try {
      // Use new SQL-backed endpoint
      const response = await apiClient.get<{
        status: string;
        source: string;
        data: {
          languages: Array<{
            language: string;
            count: number;
            percentage?: number;
          }>;
          total_items: number;
          last_updated: string;
        };
      }>("/api/analytics/languages/stats", {
        params: { source: "github" },
      });

      return (response.data.languages || []).map((lang) => ({
        language: lang.language,
        count: lang.count,
        percentage: lang.percentage || 0,
        trend: "stable" as const,
      }));
    } catch (error) {
      console.error("Error fetching language stats:", error);
      // Fallback to original endpoint
      const response = await apiClient.get<BackendAnalyticsResponse>(
        "/api/analytics",
        {
          params: { range: dateRange || "month" },
        }
      );

      return (response.data.languageStats || []).map((lang) => ({
        language: lang.language,
        count: lang.count,
        percentage: lang.percentage,
        trend: "stable" as const,
      }));
    }
  }

  async getLanguageGrowth(days: number = 7): Promise<LanguageStats[]> {
    try {
      const response = await apiClient.get<{
        status: string;
        days: number;
        data: Array<{
          language: string;
          count: number;
          percentage?: number;
          previousCount: number;
          change: number;
          changePercent: number;
          trend: "up" | "down" | "stable";
        }>;
      }>("/api/analytics/languages/growth", {
        params: { days },
      });

      return (response.data || []).map((lang) => ({
        language: lang.language,
        count: lang.count,
        percentage: lang.percentage || 0,
        trend: lang.trend,
        change: lang.changePercent,
      }));
    } catch (error) {
      console.error("Error fetching language growth:", error);
      return [];
    }
  }

  async getGrowthMetrics(
    source: "github" | "hackernews" = "github",
    days: number = 7
  ) {
    try {
      const response = await apiClient.get<{
        status: string;
        source: string;
        days: number;
        data: {
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
        };
      }>("/api/analytics/growth", {
        params: { source, days },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching growth metrics:", error);
      return {
        currentValue: 0,
        previousValue: 0,
        change: 0,
        changePercent: 0,
        trend: "stable" as const,
        itemsToday: 0,
        itemsYesterday: 0,
        itemChange: 0,
      };
    }
  }

  async getTrendData(metric: string, dateRange?: string): Promise<TrendData[]> {
    const response = await apiClient.get<{ data: any[] }>(
      "/api/analytics/daily",
      {
        params: { metric, date: dateRange },
      }
    );

    return (response.data || []).map((item: any) => ({
      date: item.date || item._id,
      value: item.value || item.count,
      category: item.category,
    }));
  }

  async getMetrics(): Promise<MetricCard[]> {
    // Return sample metrics - would need specific backend endpoint
    return [
      {
        title: "Total Growth",
        value: "+34.5%",
        change: 12.5,
        trend: "up",
      },
      {
        title: "Active Items",
        value: "1,234",
        change: 8.2,
        trend: "up",
      },
    ];
  }
}

export const analyticsService = new AnalyticsService();
