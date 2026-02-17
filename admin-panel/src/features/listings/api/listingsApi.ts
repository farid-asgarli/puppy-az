import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  Listing,
  ListingSearchRequest,
  ListingReviewRequest,
  ListingStats,
  PaginatedResponse,
  SetPremiumRequest,
  SetVipRequest,
} from "@/shared/api/types";
import { ListingStatus } from "@/shared/api/types";
import { App } from "antd";
import { useTranslation } from "react-i18next";
import { dashboardKeys } from "@/features/dashboard/api/dashboardApi";

// Query keys
export const listingsKeys = {
  all: ["listings"] as const,
  lists: () => [...listingsKeys.all, "list"] as const,
  list: (filters: ListingSearchRequest) =>
    [...listingsKeys.lists(), filters] as const,
  details: () => [...listingsKeys.all, "detail"] as const,
  detail: (id: number) => [...listingsKeys.details(), id] as const,
  stats: () => [...listingsKeys.all, "stats"] as const,
};

// Convert frontend filters to backend QuerySpecification format
function toQuerySpecification(filters: ListingSearchRequest) {
  const entries = [];

  // Title filter
  if (filters.title) {
    entries.push({
      key: "Title",
      equation: 2, // CONTAINS
      value: filters.title,
    });
  }

  // Status filter
  if (filters.status !== undefined) {
    entries.push({
      key: "Status",
      equation: 0, // EQUALS
      value: filters.status,
    });
  }

  // Min Price filter
  if (filters.minPrice) {
    entries.push({
      key: "Price",
      equation: 6, // BIGGER_EQUALS
      value: filters.minPrice,
    });
  }

  // Max Price filter
  if (filters.maxPrice) {
    entries.push({
      key: "Price",
      equation: 8, // SMALLER_EQUALS
      value: filters.maxPrice,
    });
  }

  // isPremium filter (membership)
  if (filters.isPremium !== undefined) {
    entries.push({
      key: "IsPremium",
      equation: 0, // EQUALS
      value: filters.isPremium,
    });
  }

  // adType filter (listing type)
  if (filters.adType !== undefined) {
    entries.push({
      key: "AdType",
      equation: 0, // EQUALS
      value: filters.adType,
    });
  }

  // language filter
  if (filters.language) {
    entries.push({
      key: "Language",
      equation: 0, // EQUALS
      value: filters.language,
    });
  }

  // petCategoryId filter
  if (filters.petCategoryId !== undefined) {
    entries.push({
      key: "PetCategoryId",
      equation: 0, // EQUALS
      value: filters.petCategoryId,
    });
  }

  return {
    pagination: {
      number: filters.page ?? 1,
      size: filters.pageSize ?? 10,
    },
    filter:
      entries.length > 0
        ? {
            entries,
            logicalOperator: 0, // AND_ALSO
          }
        : undefined,
    sorting: filters.sortBy
      ? [
          {
            key: filters.sortBy,
            direction: filters.sortOrder === "desc" ? 1 : 0,
          },
        ]
      : undefined,
  };
}

// Search listings
export function useListings(filters: ListingSearchRequest) {
  return useQuery({
    queryKey: listingsKeys.list(filters),
    queryFn: () =>
      api.post<PaginatedResponse<Listing>>(
        endpoints.listings.search,
        toQuerySpecification(filters),
      ),
  });
}

// Get listing stats
export function useListingStats() {
  return useQuery({
    queryKey: listingsKeys.stats(),
    queryFn: () => api.get<ListingStats>(endpoints.dashboard.listingStats),
    staleTime: 1000 * 60 * 2,
  });
}

// Review listing (approve/reject)
export function useReviewListing() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ListingReviewRequest }) => {
      // Backend expects: { id, status, rejectionReason }
      // Status: 1 = Published (approved), 2 = Rejected
      const payload = {
        id,
        status: data.approve ? 1 : 2,
        rejectionReason: data.rejectionReason || null,
      };
      return api.post(endpoints.listings.review(id), payload);
    },
    onSuccess: (_, variables) => {
      // Invalidate listings and stats
      queryClient.invalidateQueries({ queryKey: listingsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });

      // Show appropriate success message
      if (variables.data.approve) {
        message.success(t("listings.approvedSuccess"));
      } else {
        message.success(t("listings.rejectedSuccess"));
      }
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Set premium status for a listing
export function useSetPremium() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SetPremiumRequest }) =>
      api.post(endpoints.listings.premium(id), {
        id,
        isPremium: data.isPremium,
        durationInDays: data.durationInDays,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: listingsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });

      if (variables.data.isPremium) {
        message.success(t("listings.premiumSetSuccess"));
      } else {
        message.success(t("listings.premiumRemovedSuccess"));
      }
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Set VIP status for a listing
export function useSetVip() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SetVipRequest }) =>
      api.post(endpoints.listings.vip(id), {
        id,
        isVip: data.isVip,
        durationInDays: data.durationInDays,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: listingsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });

      if (variables.data.isVip) {
        message.success(t("listings.vipSetSuccess"));
      } else {
        message.success(t("listings.vipRemovedSuccess"));
      }
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Set status for a listing (admin direct status change)
export function useSetListingStatus() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ListingStatus }) =>
      api.post(endpoints.listings.setStatus(id), {
        id,
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      message.success(t("listings.statusUpdateSuccess"));
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Get listing by ID (admin - no status restrictions)
export function useListingById(id: number | undefined) {
  return useQuery({
    queryKey: listingsKeys.detail(id!),
    queryFn: () => api.get<Listing>(endpoints.listings.getById(id!)),
    enabled: !!id,
  });
}

// Assign breed to a listing (after creating breed from suggestion)
export function useAssignBreedToListing() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      petAdId,
      petBreedId,
    }: {
      petAdId: number;
      petBreedId: number;
    }) =>
      api.post(endpoints.listings.assignBreed(petAdId), {
        petAdId,
        petBreedId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingsKeys.all });
      message.success(
        t("listings.breedAssignSuccess", "Cins elana uğurla təyin edildi"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Assign district to a listing (after creating district from suggestion)
export function useAssignDistrictToListing() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      petAdId,
      districtId,
    }: {
      petAdId: number;
      districtId: number;
    }) =>
      api.post(endpoints.listings.assignDistrict(petAdId), {
        petAdId,
        districtId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingsKeys.all });
      message.success(
        t("listings.districtAssignSuccess", "Rayon elana uğurla təyin edildi"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}
