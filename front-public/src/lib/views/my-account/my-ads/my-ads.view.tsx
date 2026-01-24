"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  IconEye,
  IconClock,
  IconAlertCircle,
  IconLayoutGrid,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/external/utils";
import {
  MyAdListItemDto,
  PetAdListItemDto,
  PetAdStatus,
} from "@/lib/api/types/pet-ad.types";
import { PaginatedResult } from "@/lib/api/types/common.types";
import {
  getUserActiveAdsAction,
  getUserPendingAdsAction,
  getUserRejectedAdsAction,
  getAllUserAdsAction,
  closeAdAction,
} from "@/lib/auth/actions";
import { usePaginatedData } from "@/lib/hooks/use-paginated-data";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import { AdsSummary } from "@/lib/components/views/my-account";
import { Heading, Text } from "@/lib/primitives/typography";
import { EmptyState } from "@/lib/primitives/empty-state";
import { Spinner } from "@/lib/primitives/spinner";
import Button from "@/lib/primitives/button/button.component";
import TransitionLink from "@/lib/components/transition-link";
import { MyAdCard, mapAdToMyAdCard } from "@/lib/components/cards/my-ad-card";
import { MyAdDetails } from "@/lib/components/drawers/my-ad-drawer";

type FilterTab = "active" | "pending" | "rejected" | "all";

interface MyAdsViewProps {
  initialData: PaginatedResult<PetAdListItemDto>;
  initialStats: {
    totalAds: number;
    activeAds: number;
    pendingAds: number;
    rejectedAds: number;
  };
  initialPage: number;
  initialTab?: FilterTab;
}

/**
 * MyAdsView - Unified view for all user ads management
 *
 * Features:
 * - Stats summary dashboard
 * - Filter tabs (All, Active, Pending, Rejected)
 * - Infinite scroll ad list
 * - Click to view details in drawer
 * - Empty states for each filter
 * - Refresh all functionality
 * - Lazy loading for non-active tabs
 */
export default function MyAdsView({
  initialData,
  initialStats,
  initialPage,
  initialTab = "active",
}: MyAdsViewProps) {
  const t = useTranslations("myAccount.myAds");
  const tCommon = useTranslations("common");

  const [stats, setStats] = useState(initialStats);
  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);
  const [drawerAdId, setDrawerAdId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Store data for each tab separately - initialize based on initialTab
  const [activeAds, setActiveAds] = useState<PetAdListItemDto[]>(
    initialTab === "active" ? initialData.items : [],
  );
  const [pendingAds, setPendingAds] = useState<PetAdListItemDto[]>(
    initialTab === "pending" ? initialData.items : [],
  );
  const [rejectedAds, setRejectedAds] = useState<PetAdListItemDto[]>(
    initialTab === "rejected" ? initialData.items : [],
  );
  const [allAds, setAllAds] = useState<MyAdListItemDto[]>(
    initialTab === "all" ? (initialData.items as MyAdListItemDto[]) : [],
  );

  // Track which tabs have been loaded - start with initialTab
  const [loadedTabs, setLoadedTabs] = useState<Set<FilterTab>>(
    new Set([initialTab]),
  );

  // Determine which action to use based on active tab
  const getFetchAction = (tab: FilterTab) => {
    switch (tab) {
      case "active":
        return getUserActiveAdsAction;
      case "pending":
        return getUserPendingAdsAction;
      case "rejected":
        return getUserRejectedAdsAction;
      case "all":
        return getAllUserAdsAction;
      default:
        return getUserActiveAdsAction;
    }
  };

  // Get current items based on active tab
  const getCurrentItems = () => {
    switch (activeTab) {
      case "active":
        return activeAds;
      case "pending":
        return pendingAds;
      case "rejected":
        return rejectedAds;
      case "all":
        return allAds;
      default:
        return activeAds;
    }
  };

  // Initial data for paginated hook
  const getInitialDataForTab = (
    tab: FilterTab,
  ): PaginatedResult<PetAdListItemDto> => {
    if (tab === initialTab) {
      return initialData;
    }
    return {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 12,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  };

  // Paginated data with infinite scroll
  const {
    hasMore,
    isLoading: isLoadingMore,
    loadMore,
  } = usePaginatedData({
    initialData: getInitialDataForTab(activeTab),
    initialPage: activeTab === initialTab ? initialPage : 1,
    pageSize: 12,
    fetchAction: getFetchAction(activeTab),
  });

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
    threshold: 300,
  });

  // Load data for tab when switching
  const handleTabChange = async (tab: FilterTab) => {
    setActiveTab(tab);

    // If tab hasn't been loaded yet, fetch its data
    if (!loadedTabs.has(tab)) {
      setLoadedTabs((prev) => new Set(prev).add(tab));

      // Fetch data for this tab
      try {
        const action = getFetchAction(tab);
        const result = await action({
          pagination: { number: 1, size: 12 },
        });

        if (result.success) {
          switch (tab) {
            case "pending":
              setPendingAds(result.data.items);
              break;
            case "rejected":
              setRejectedAds(result.data.items);
              break;
            case "all":
              setAllAds(result.data.items as MyAdListItemDto[]);
              break;
          }
        }
      } catch (error) {
        console.error("Failed to load tab data:", error);
        toast.error(t("errors.loadFailed"));
      }
    }
  };

  // Refresh all data
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      // Fetch all ad types
      const [activeResult, pendingResult, rejectedResult, allResult] =
        await Promise.all([
          getUserActiveAdsAction({ pagination: { number: 1, size: 12 } }),
          getUserPendingAdsAction({ pagination: { number: 1, size: 12 } }),
          getUserRejectedAdsAction({ pagination: { number: 1, size: 12 } }),
          getAllUserAdsAction({ pagination: { number: 1, size: 12 } }),
        ]);

      if (activeResult.success) {
        setActiveAds(activeResult.data.items);
      }
      if (pendingResult.success) {
        setPendingAds(pendingResult.data.items);
      }
      if (rejectedResult.success) {
        setRejectedAds(rejectedResult.data.items);
      }
      if (allResult.success) {
        setAllAds(allResult.data.items);
      }

      // Update stats
      const newStats = {
        totalAds:
          (activeResult.success ? activeResult.data.totalCount : 0) +
          (pendingResult.success ? pendingResult.data.totalCount : 0) +
          (rejectedResult.success ? rejectedResult.data.totalCount : 0),
        activeAds: activeResult.success ? activeResult.data.totalCount : 0,
        pendingAds: pendingResult.success ? pendingResult.data.totalCount : 0,
        rejectedAds: rejectedResult.success
          ? rejectedResult.data.totalCount
          : 0,
      };
      setStats(newStats);

      // Mark all tabs as loaded
      setLoadedTabs(new Set(["active", "pending", "rejected", "all"]));

      toast.success(t("notifications.refreshSuccess"));
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error(t("notifications.refreshError"));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle card click to open drawer
  const handleCardClick = (id: number) => {
    setDrawerAdId(id);
    setDrawerOpen(true);
  };

  // Handle close ad action
  const handleCloseAd = async (adId: number) => {
    try {
      const result = await closeAdAction(adId);
      if (result.success) {
        // Remove from active ads, update stats
        setActiveAds((prev) => prev.filter((ad) => ad.id !== adId));
        setAllAds((prev) => prev.filter((ad) => ad.id !== adId));
        setStats((prev) => ({
          ...prev,
          activeAds: Math.max(0, prev.activeAds - 1),
          totalAds: Math.max(0, prev.totalAds - 1),
        }));
        toast.success(
          t("notifications.closeSuccess", {
            defaultValue: "Ad closed successfully",
          }),
        );
        setDrawerOpen(false);
      } else {
        toast.error(
          result.error ||
            t("notifications.closeError", {
              defaultValue: "Failed to close ad",
            }),
        );
      }
    } catch (error) {
      console.error("Close ad error:", error);
      toast.error(
        t("notifications.closeError", { defaultValue: "Failed to close ad" }),
      );
    }
  };

  // Filter tabs configuration
  const tabs: Array<{
    id: FilterTab;
    label: string;
    icon: typeof IconLayoutGrid;
    count: number;
  }> = [
    {
      id: "active",
      label: t("tabs.active"),
      icon: IconEye,
      count: stats.activeAds,
    },
    {
      id: "pending",
      label: t("tabs.pending"),
      icon: IconClock,
      count: stats.pendingAds,
    },
    {
      id: "rejected",
      label: t("tabs.rejected"),
      icon: IconAlertCircle,
      count: stats.rejectedAds,
    },
    {
      id: "all",
      label: t("tabs.all"),
      icon: IconLayoutGrid,
      count: stats.totalAds,
    },
  ];

  // Empty state configuration based on active tab
  const emptyStateConfig = {
    all: {
      icon: IconPlus,
      title: t("emptyStates.noAds.title"),
      description: t("emptyStates.noAds.description"),
    },
    active: {
      icon: IconEye,
      title: t("emptyStates.noActive.title"),
      description: t("emptyStates.noActive.description"),
    },
    pending: {
      icon: IconClock,
      title: t("emptyStates.noPending.title"),
      description: t("emptyStates.noPending.description"),
    },
    rejected: {
      icon: IconAlertCircle,
      title: t("emptyStates.noRejected.title"),
      description: t("emptyStates.noRejected.description"),
    },
  };

  const currentEmptyState = emptyStateConfig[activeTab];
  const currentItems = getCurrentItems();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Heading
                variant="page-title"
                as="h1"
                className="text-2xl sm:text-3xl lg:text-4xl"
              >
                {t("title")}
              </Heading>
              <Text
                variant="body-lg"
                color="secondary"
                className="text-base sm:text-lg"
              >
                {t("subtitle", { count: stats.totalAds })}
              </Text>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                leftSection={<IconRefresh size={18} />}
                onClick={handleRefreshAll}
                disabled={isRefreshing}
              >
                {isRefreshing ? t("actions.refreshing") : t("actions.refresh")}
              </Button>
              <TransitionLink href="/ads/ad-placement">
                <Button
                  variant="solid"
                  size="md"
                  leftSection={<IconPlus size={18} />}
                >
                  {t("actions.newAd")}
                </Button>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        <div className="space-y-8">
          {/* Stats Summary */}
          <AdsSummary stats={stats} loading={false} />

          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto -mb-px">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b-2 transition-all duration-200 whitespace-nowrap",
                      "font-medium text-sm sm:text-base",
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    )}
                  >
                    <TabIcon size={18} className="shrink-0" />
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ads Grid */}
          {currentItems.length === 0 ? (
            <EmptyState
              icon={<currentEmptyState.icon size={48} strokeWidth={1.5} />}
              title={currentEmptyState.title}
              description={currentEmptyState.description}
              action={
                <TransitionLink href="/ads/ad-placement">
                  <Button variant="solid" leftSection={<IconPlus size={18} />}>
                    {t("actions.newAd")}
                  </Button>
                </TransitionLink>
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentItems.map((ad) => {
                  // Determine status based on tab if not provided in ad data
                  const getStatusForTab = (): PetAdStatus => {
                    // If ad already has status (from MyAdListItemDto), use it
                    if (
                      "status" in ad &&
                      typeof (ad as MyAdListItemDto).status === "number"
                    ) {
                      return (ad as MyAdListItemDto).status;
                    }
                    // Otherwise determine from current tab
                    switch (activeTab) {
                      case "active":
                        return PetAdStatus.Published;
                      case "pending":
                        return PetAdStatus.Pending;
                      case "rejected":
                        return PetAdStatus.Rejected;
                      default:
                        return PetAdStatus.Published;
                    }
                  };

                  // Map PetAdListItemDto to MyAdListItemDto format
                  const myAdData = {
                    ...ad,
                    status: getStatusForTab(),
                    viewCount: (ad as MyAdListItemDto)["viewCount"] ?? 0, // Default viewCount
                    createdAt:
                      (ad as MyAdListItemDto)["createdAt"] ??
                      new Date().toISOString(),
                  };
                  return (
                    <MyAdCard
                      key={ad.id}
                      {...mapAdToMyAdCard(myAdData)}
                      onClick={handleCardClick}
                    />
                  );
                })}
              </div>

              {/* Load More Indicator */}
              {hasMore && (
                <div ref={loadMoreRef} className="py-8 flex justify-center">
                  {isLoadingMore && (
                    <Spinner size="md" text={tCommon("loading")} />
                  )}
                </div>
              )}

              {/* End of List Message */}
              {!hasMore && currentItems.length > 6 && (
                <div className="py-8 text-center">
                  <Text variant="body" color="secondary">
                    {t("endOfList")}
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ad Details Drawer */}
      {drawerAdId && (
        <MyAdDetails
          adId={drawerAdId}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onCloseAd={handleCloseAd}
        />
      )}
    </div>
  );
}
