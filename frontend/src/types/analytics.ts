// Analytics Data Types
export interface LanguageStats {
  language: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  change?: number;
  changePercent?: number;
  previousCount?: number;
}

export interface TrendData {
  date: string;
  value: number;
  category?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "stable";
  icon?: string;
}

export interface AnalyticsState {
  languageStats: LanguageStats[];
  trendData: TrendData[];
  metrics: MetricCard[];
  isLoading: boolean;
  error: string | null;
}
