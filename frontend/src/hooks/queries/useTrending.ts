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
  page?: number;
  pageSize?: number;
  source?: "github" | "hackernews";
  timeRange?: "today" | "week" | "month";
  sort?: "popularity" | "recent" | "stars" | "stars_asc" | "score" | "score_asc";
  enhanced?: boolean;
  language?: string;
  minStars?: number;
  minPoints?: number;
}

export interface TrendingApiResponse<TItem = unknown> {
  status: string;
  count: number;
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  timeRange?: string;
  source?: string;
  enhanced?: boolean;
  data: TItem[];
}

// Trending Items Query
export function useTrending<TItem = unknown>(params: TrendingParams = {}) {
  return useQuery({
    queryKey: trendingKeys.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<TrendingApiResponse<TItem>>("/api/trending", {
        params: params as Record<string, string | number | boolean | undefined>,
      }),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

// Trending by Source Query
export function useTrendingBySource<TItem = unknown>(
  source: "github" | "hackernews",
  params: Omit<TrendingParams, "source"> = {}
) {
  return useQuery({
    queryKey: trendingKeys.bySource(source, params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<TrendingApiResponse<TItem>>(`/api/trending/${source}`, {
        params: params as Record<string, string | number | boolean | undefined>,
      }),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}
