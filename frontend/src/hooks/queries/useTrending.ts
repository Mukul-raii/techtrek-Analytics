import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

// Query Keys
export const trendingKeys = {
  all: ["trending"] as const,
  list: (filters: Record<string, unknown>) =>
    [...trendingKeys.all, "list", filters] as const,
  bySource: (source: string, filters: Record<string, unknown>) =>
    [...trendingKeys.all, source, filters] as const,
};

interface TrendingParams {
  limit?: number;
  source?: "github" | "hackernews";
  timeRange?: "today" | "week" | "month";
  sort?: string;
  enhanced?: boolean;
  language?: string;
  minStars?: number;
  minPoints?: number;
}

// Trending Items Query
export function useTrending(params: TrendingParams = {}) {
  return useQuery({
    queryKey: trendingKeys.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get("/api/trending", {
        params: params as Record<string, string | number | boolean | undefined>,
      }),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

// Trending by Source Query
export function useTrendingBySource(
  source: "github" | "hackernews",
  params: Omit<TrendingParams, "source"> = {}
) {
  return useQuery({
    queryKey: trendingKeys.bySource(source, params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get(`/api/trending/${source}`, {
        params: params as Record<string, string | number | boolean | undefined>,
      }),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}
