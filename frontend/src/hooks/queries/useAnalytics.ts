import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

// Query Keys
export const analyticsKeys = {
  all: ["analytics"] as const,
  list: (filters: Record<string, unknown>) =>
    [...analyticsKeys.all, "list", filters] as const,
  daily: (params: Record<string, unknown>) =>
    [...analyticsKeys.all, "daily", params] as const,
  github: () => [...analyticsKeys.all, "github"] as const,
  hackernews: () => [...analyticsKeys.all, "hackernews"] as const,
};

interface AnalyticsParams {
  range?: "week" | "month" | "quarter" | "year";
  compare?: boolean;
}

// Analytics Query
export function useAnalytics(params: AnalyticsParams = {}) {
  return useQuery({
    queryKey: analyticsKeys.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get("/api/analytics", {
        params: params as Record<string, string | number | boolean | undefined>,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Daily Analytics Query
interface DailyAnalyticsParams {
  metric?: string;
  date?: string;
}

export function useDailyAnalytics(params: DailyAnalyticsParams = {}) {
  return useQuery({
    queryKey: analyticsKeys.daily(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get("/api/analytics/daily", {
        params: params as Record<string, string | number | boolean | undefined>,
      }),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// GitHub Analytics Query
export function useGithubAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.github(),
    queryFn: () => apiClient.get("/api/analytics/github"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// HackerNews Analytics Query
export function useHackerNewsAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.hackernews(),
    queryFn: () => apiClient.get("/api/analytics/hackernews"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
