import { apiClient } from '@/api/client';
import type { LanguageStats, TrendData, MetricCard } from '@/types/analytics';

export interface AnalyticsOverall {
  totalItems: number;
  githubCount: number | null;
  hackerNewsCount: number | null;
  avgPopularity: number | null;
}

export interface AnalyticsSourceData {
  source: 'github' | 'hackernews';
  totalItems: number;
  avgStars?: number | null;
  avgPoints?: number | null;
  topLanguages: string[];
  growthTrend: string;
}

export interface DailyMetric {
  date: string;
  count: number;
  avgPopularity: number;
}

class AnalyticsService {
  async getOverallAnalytics(range: 'day' | 'week' | 'month' = 'month'): Promise<AnalyticsOverall> {
    const response = await apiClient.get<{
      status: string;
      range: string;
      data: AnalyticsOverall;
    }>(`/analytics?range=${range}`);
    return response.data;
  }

  async getSourceAnalytics(source: 'github' | 'hackernews', range: 'day' | 'week' | 'month' = 'month'): Promise<AnalyticsSourceData> {
    const response = await apiClient.get<{
      status: string;
      source: string;
      range: string;
      data: AnalyticsSourceData;
    }>(`/analytics/${source}?range=${range}`);
    return response.data;
  }

  async getDailyMetrics(range: 'week' | 'month' = 'week'): Promise<DailyMetric[]> {
    const response = await apiClient.get<{
      status: string;
      range: string;
      data: DailyMetric[];
    }>(`/analytics/daily?range=${range}`);
    return response.data;
  }

  // Legacy methods for backward compatibility
  async getAnalytics(_dateRange: string = 'week') {
    const [githubData, hackerNewsData] = await Promise.all([
      this.getSourceAnalytics('github', 'month').catch(() => null),
      this.getSourceAnalytics('hackernews', 'month').catch(() => null),
    ]);

    const languageStats: LanguageStats[] = githubData?.topLanguages?.map((lang, index) => ({
      language: lang,
      count: 100 - (index * 10), // Placeholder
      percentage: 20 - (index * 5), // Placeholder
      trend: 'stable' as const,
    })) || [];

    const metrics: MetricCard[] = [
      {
        title: 'Total Items',
        value: (githubData?.totalItems || 0) + (hackerNewsData?.totalItems || 0),
        change: 12.5,
        trend: 'up',
        icon: '📊',
      },
    ];

    return {
      languageStats,
      trendData: [],
      metrics,
    };
  }

  async getLanguageStats(_dateRange?: string): Promise<LanguageStats[]> {
    const githubData = await this.getSourceAnalytics('github', 'month').catch(() => null);
    
    return githubData?.topLanguages?.map((lang, index) => ({
      language: lang,
      count: 100 - (index * 10), // Placeholder
      percentage: 20 - (index * 5), // Placeholder
      trend: 'stable' as const,
    })) || [];
  }

  async getTrendData(_metric: string, _dateRange?: string): Promise<TrendData[]> {
    const dailyMetrics = await this.getDailyMetrics('week').catch(() => []);
    
    return dailyMetrics.map((item) => ({
      date: item.date,
      value: item.count,
      label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }
}

export const analyticsService = new AnalyticsService();
