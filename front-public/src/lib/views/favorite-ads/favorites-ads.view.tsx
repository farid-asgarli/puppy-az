"use client";

import { useState, useCallback, useMemo } from "react";
import { IconHeartBroken, IconLogin } from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { useFavorites } from "@/lib/hooks/use-favorites";
import NarrowContainer from "@/lib/components/narrow-container";
import { Spinner } from "@/lib/primitives/spinner";
import { EmptyState } from "@/lib/primitives/empty-state";
import {
  PageHeader,
  InfoBanner,
  ViewToggle,
  SearchInput,
  LoadMoreIndicator,
} from "@/lib/components/views/common";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserFavoriteAdsAction } from "@/lib/auth/actions";
import { petAdService } from "@/lib/api/services/pet-ad.service";
import { FilterEquation, LogicalOperator } from "@/lib/api/types/common.types";
import Button from "@/lib/primitives/button/button.component";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import ResponsiveAdCard from "@/lib/components/cards/item-card/responsive-ad-card";
import TransitionLink from "@/lib/components/transition-link";
import { mapAdToCardItem } from "@/lib/components/cards/item-card/ad-card.utils";
import { usePaginatedAds } from "@/lib/hooks/use-paginated-ads";
import { useTranslations } from "next-intl";
import { useLocale } from "@/lib/hooks/use-client-locale";

const FavoriteAdsView = () => {
  const t = useTranslations("favorites");
  const tDateTime = useTranslations("dateTime");
  const locale = useLocale();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { favorites, syncFavoritesFromBackend } = useFavorites();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch function that adapts to auth state, with locale from URL
  const fetchFavoriteAds = useCallback(
    async (page: number, pageSize: number) => {
      if (isAuthenticated) {
        // Fetch from API for authenticated users
        const result = await getUserFavoriteAdsAction({
          pagination: { number: page, size: pageSize },
        });

        if (result.success) {
          const mappedAds = result.data.items.map((ad) =>
            mapAdToCardItem(ad, tDateTime),
          );

          // Sync favorites from backend to ensure UI is correct
          const adIds = result.data.items.map((ad) => ad.id);
          syncFavoritesFromBackend(adIds);

          return {
            items: mappedAds,
            totalCount: result.data.totalCount,
            hasNextPage: result.data.hasNextPage,
          };
        }
        // If API fails, fall through to localStorage fetch
      }

      // Fetch from localStorage for unauthenticated users or API fallback
      if (favorites.size === 0) {
        return {
          items: [],
          totalCount: 0,
          hasNextPage: false,
        };
      }

      // Fetch ads by IDs from localStorage (no pagination for local)
      const favoriteIds = Array.from(favorites);
      const result = await petAdService.searchPetAds(
        {
          filter: {
            entries: favoriteIds.map((id) => ({
              key: "id",
              value: id,
              equation: FilterEquation.EQUALS,
            })),
            logicalOperator: LogicalOperator.OR_ELSE,
          },
          pagination: { number: 1, size: 100 },
        },
        locale,
      );

      const mappedAds = result.items.map((ad) =>
        mapAdToCardItem(ad, tDateTime),
      );
      return {
        items: mappedAds,
        totalCount: mappedAds.length,
        hasNextPage: false,
      };
    },
    [
      isAuthenticated,
      favorites,
      syncFavoritesFromBackend,
      t,
      locale,
      tDateTime,
    ],
  );

  // Use paginated ads hook
  const { ads, isLoading, isLoadingMore, hasMore, error, loadMore } =
    usePaginatedAds({
      fetchAds: fetchFavoriteAds,
      pageSize: 12,
      refetchKey: `${isAuthenticated}-${favorites.size}`,
      fetchOnMount: !authLoading,
    });

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
    threshold: 300,
  });

  // Filter ads by search query
  const filteredAds = useMemo(() => {
    if (!searchQuery.trim()) return ads;

    const query = searchQuery.toLowerCase().trim();
    return ads.filter((ad) => {
      // Search in title, category, location
      const searchableText = [ad.title, ad.animalCategory, ad.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [ads, searchQuery]);

  // Loading state
  if (authLoading || (isLoading && ads.length === 0)) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title={t("title")} subtitle={t("loading")} showBackButton />
        <NarrowContainer className="py-8 sm:py-12 flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" color="primary" text={t("loadingAds")} />
        </NarrowContainer>
      </div>
    );
  }

  const subtitle =
    ads.length > 0
      ? t("subtitle.withCount", { count: filteredAds.length })
      : t("subtitle.empty");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PageHeader title={t("title")} subtitle={subtitle} showBackButton />

      {/* Main Content */}
      <NarrowContainer className="py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Error Alert */}
          {error && (
            <InfoBanner
              variant="error"
              icon={IconHeartBroken}
              title={t("error.title")}
              description={error}
            />
          )}

          {/* Not authenticated banner */}
          {!isAuthenticated && ads.length > 0 && (
            <InfoBanner
              variant="info"
              icon={IconLogin}
              title={t("loginBanner.title")}
              description={t("loginBanner.description")}
              action={
                <TransitionLink href="/auth">
                  <Button
                    variant="solid"
                    size="sm"
                    leftSection={<IconLogin size={16} />}
                  >
                    {t("emptyState.loginButton")}
                  </Button>
                </TransitionLink>
              }
            />
          )}

          {/* Filters & View Toggle */}
          {ads.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t("search.placeholder")}
                />
              </div>

              {/* View Mode Toggle */}
              <ViewToggle mode={viewMode} onModeChange={setViewMode} />
            </div>
          )}

          {/* Empty State */}
          {ads.length === 0 && !isLoading && (
            <EmptyState
              icon={<IconHeartBroken />}
              title={
                isAuthenticated
                  ? t("emptyState.authenticated.title")
                  : t("emptyState.unauthenticated.title")
              }
              description={
                isAuthenticated
                  ? t("emptyState.authenticated.description")
                  : t("emptyState.unauthenticated.description")
              }
              action={
                !isAuthenticated ? (
                  <TransitionLink href="/auth">
                    <Button
                      variant="solid"
                      leftSection={<IconLogin size={18} />}
                    >
                      {t("emptyState.loginButton")}
                    </Button>
                  </TransitionLink>
                ) : (
                  <TransitionLink href="/">
                    <Button variant="solid">
                      {t("emptyState.exploreButton")}
                    </Button>
                  </TransitionLink>
                )
              }
            />
          )}

          {/* Ads Grid/List */}
          {ads.length > 0 && (
            <>
              {filteredAds.length > 0 ? (
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                      : "flex flex-col gap-3 sm:gap-4",
                  )}
                >
                  {filteredAds.map((ad) => (
                    <div key={ad.id}>
                      <ResponsiveAdCard {...ad} viewMode={viewMode} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<IconHeartBroken />}
                  title={t("search.noResults.title")}
                  description={t("search.noResults.description")}
                />
              )}

              {/* Infinite Scroll Trigger & Loading Indicator */}
              {isAuthenticated && (
                <div ref={loadMoreRef} className="mt-6 sm:mt-8">
                  <LoadMoreIndicator
                    isLoading={isLoadingMore}
                    hasMore={hasMore}
                    completedText={t("loadMore.completed")}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </NarrowContainer>
    </div>
  );
};

export default FavoriteAdsView;
