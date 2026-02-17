import { useQuery } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  DashboardStats,
  ListingStats,
  ChartStats,
  ChartStatsRequest,
} from "@/shared/api/types";

// Query keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  listingStats: () => [...dashboardKeys.all, "listing-stats"] as const,
  chartStats: (params?: ChartStatsRequest) =>
    [...dashboardKeys.all, "chart-stats", params] as const,
  pendingCount: () => [...dashboardKeys.all, "pending-count"] as const,
  newMessagesCount: () => [...dashboardKeys.all, "new-messages"] as const,
};

// Dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => api.get<DashboardStats>(endpoints.dashboard.stats),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

// Chart stats with filters
export function useChartStats(params?: ChartStatsRequest) {
  const queryParams = new URLSearchParams();
  if (params?.period) queryParams.set("period", params.period);
  if (params?.year) queryParams.set("year", params.year.toString());

  const url = queryParams.toString()
    ? `${endpoints.dashboard.chartStats}?${queryParams.toString()}`
    : endpoints.dashboard.chartStats;

  return useQuery({
    queryKey: dashboardKeys.chartStats(params),
    queryFn: () => api.get<ChartStats>(url),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
}

// Listing stats (for status counts)
export function useListingStats() {
  return useQuery({
    queryKey: dashboardKeys.listingStats(),
    queryFn: () => api.get<ListingStats>(endpoints.dashboard.listingStats),
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}

// Pending listings count for sidebar badge
export function usePendingListingsCount() {
  return useQuery({
    queryKey: dashboardKeys.pendingCount(),
    queryFn: async () => {
      try {
        const stats = await api.get<ListingStats>(
          endpoints.dashboard.listingStats,
        );
        return stats.pending || 0;
      } catch {
        return 0;
      }
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}

// New messages count for sidebar badge
export function useNewMessagesCount() {
  return useQuery({
    queryKey: dashboardKeys.newMessagesCount(),
    queryFn: async () => {
      try {
        const stats = await api.get<DashboardStats>(endpoints.dashboard.stats);
        return stats.newMessages || 0;
      } catch {
        return 0;
      }
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}
