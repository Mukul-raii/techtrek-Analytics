import { apiClient } from '@/api/client';
import type { LanguageStats, TrendData, MetricCard } from '@/types/analytics';

interface BackendAnalyticsResponse {
  status: string;
  data: {
    totalItems: number;
    sourceBreakdown: { source: string; count: number }[];
    languageStats: any[];
    dateRange: { start: string; end: string };
  };
}

class AnalyticsService {
  async getAnalytics(dateRange: string = 'week') {
    const response = await apiClient.get<BackendAnalyticsResponse>('/api/analytics', {
      params: { date: dateRange },
    });

    // Transform backend data to frontend format
    const languageStats: LanguageStats[] = (response.data.languageStats || []).map((lang: any) => ({
      language: lang.language || lang.name,
      count: lang.count || lang.value,
      percentage: lang.percentage || 0,
      trend: 'stable' as const,
    }));

    const metrics: MetricCard[] = [
      {
        title: 'Total Items',
        value: response.data.totalItems || 0,
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

  async getLanguageStats(dateRange?: string): Promise<LanguageStats[]> {
    const response = await apiClient.get<BackendAnalyticsResponse>('/api/analytics', {
      params: { date: dateRange },
    });

    return (response.data.languageStats || []).map((lang: any) => ({
      language: lang.language || lang.name,
      count: lang.count || lang.value,
      percentage: lang.percentage || 0,
      trend: 'stable' as const,
    }));
  }

  async getTrendData(metric: string, dateRange?: string): Promise<TrendData[]> {
    const response = await apiClient.get<{ data: any[] }>('/api/analytics/daily', {
      params: { metric, date: dateRange },
    });

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
        title: 'Total Growth',
        value: '+34.5%',
        change: 12.5,
        trend: 'up',
      },
      {
        title: 'Active Items',
        value: '1,234',
        change: 8.2,
        trend: 'up',
      },
    ];
  }
}

export const analyticsService = new AnalyticsService();
