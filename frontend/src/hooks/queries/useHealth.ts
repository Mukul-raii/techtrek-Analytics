import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

// Query Keys
export const healthKeys = {
  all: ["health"] as const,
  status: () => [...healthKeys.all, "status"] as const,
};

// Health Check Query
export function useHealth() {
  return useQuery({
    queryKey: healthKeys.status(),
    queryFn: () => apiClient.get("/health"),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}
