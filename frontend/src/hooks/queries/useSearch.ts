import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

// Query Keys
export const searchKeys = {
  all: ["search"] as const,
  results: (query: string, filters: Record<string, unknown>) =>
    [...searchKeys.all, "results", query, filters] as const,
  suggestions: (query: string) =>
    [...searchKeys.all, "suggestions", query] as const,
};

interface SearchParams {
  q: string;
  source?: "github" | "hackernews";
  language?: string;
  limit?: number;
}

// Search Query
export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: searchKeys.results(
      params.q,
      params as unknown as Record<string, unknown>
    ),
    queryFn: () =>
      apiClient.get("/api/search", {
        params: params as unknown as Record<
          string,
          string | number | boolean | undefined
        >,
      }),
    enabled: !!params.q && params.q.length > 0, // Only run if query exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Search Suggestions Query
export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: searchKeys.suggestions(query),
    queryFn: () =>
      apiClient.get("/api/search/suggest", { params: { q: query } }),
    enabled: !!query && query.length >= 2, // Only run if query is at least 2 characters
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
