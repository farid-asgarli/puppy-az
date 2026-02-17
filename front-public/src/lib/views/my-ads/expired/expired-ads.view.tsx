"use client";

import { IconClock } from "@tabler/icons-react";
import type { PetAdListItemDto } from "@/lib/api/types/pet-ad.types";
import MyAdsBaseView from "@/lib/views/my-ads/base/my-ads-base.view";
import { getUserExpiredAdsAction } from "@/lib/auth/actions";
import { PaginatedResult } from "@/lib/api";
import { useTranslations } from "next-intl";

interface ExpiredAdsViewProps {
  initialData: PaginatedResult<PetAdListItemDto>;
  initialPage: number;
}

export default function ExpiredAdsView({
  initialData,
  initialPage,
}: ExpiredAdsViewProps) {
  const t = useTranslations("myAds.expired");

  const subtitle =
    initialData.totalCount > 0
      ? t("subtitle.withCount", { count: initialData.totalCount })
      : t("subtitle.empty");

  return (
    <MyAdsBaseView
      initialData={initialData}
      initialPage={initialPage}
      pageTitle={t("pageTitle")}
      pageSubtitle={subtitle}
      loadMoreAction={getUserExpiredAdsAction}
      infoBanner={{
        icon: IconClock,
        title: t("infoBanner.title"),
        description: t("infoBanner.description"),
        variant: "warning",
      }}
      emptyState={{
        icon: IconClock,
        title: t("emptyState.title"),
        description: t("emptyState.description"),
      }}
      confirmDialog={{
        title: t("confirmDialog.title"),
        message: t("confirmDialog.message"),
        confirmText: t("confirmDialog.confirmButton"),
      }}
      showReactivateButton={true}
    />
  );
}
