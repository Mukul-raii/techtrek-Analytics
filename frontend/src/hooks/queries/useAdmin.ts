import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

// Query Keys
export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  metrics: () => [...adminKeys.all, "metrics"] as const,
};

// Admin Stats Query
export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => apiClient.get("/api/admin/stats"),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Admin Metrics Query
export function useAdminMetrics() {
  return useQuery({
    queryKey: adminKeys.metrics(),
    queryFn: () => apiClient.get("/api/admin/metrics"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Trigger Ingestion Mutation
export function useTriggerIngestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (source: string) =>
      apiClient.post("/api/admin/ingest", { source }),
    onSuccess: () => {
      // Invalidate and refetch admin stats
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}
