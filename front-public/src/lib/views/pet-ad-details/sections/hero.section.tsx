"use client";

import { useState } from "react";
import { PetAdDetailsDto, PetAdStatus } from "@/lib/api/types/pet-ad.types";
import {
  IconMapPin,
  IconEye,
  IconClock,
  IconPencil,
  IconPower,
  IconLoader2,
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils/date-utils";
import { ActionButtonGroup } from "@/lib/components/views/pet-ad-details/action-button-group";
import { Badge } from "@/lib/components/views/pet-ad-details/badge";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { closeAdAction } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/lib/components/confirmation-dialog/confirmation-dialog.component";

export interface AdDetailsHeroSectionProps {
  adDetails: PetAdDetailsDto;
  isHydrated: boolean;
  isOwner?: boolean;
}

export function AdDetailsHeroSection({
  adDetails,
  isHydrated,
  isOwner = false,
}: AdDetailsHeroSectionProps) {
  const t = useTranslations("petAdDetails.hero");
  const tEdit = useTranslations("petAdDetails.statusBanner");
  const tDate = useTranslations("dateTime");
  const router = useRouter();
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Check if ad can be deactivated (only Active or Pending ads)
  const canDeactivate =
    isOwner &&
    (adDetails.status === PetAdStatus.Published ||
      adDetails.status === PetAdStatus.Pending);

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = async () => {
    if (isDeactivating) return;

    setIsDeactivating(true);
    try {
      const result = await closeAdAction(adDetails.id);
      if (result.success) {
        setShowDeactivateModal(false);
        router.refresh();
      } else {
        alert(result.error || tEdit("deactivateError"));
      }
    } catch {
      alert(tEdit("deactivateError"));
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button + Actions Row */}
      <ActionButtonGroup
        adId={adDetails.id}
        adType={adDetails.adType}
        adTitle={adDetails.title}
        adDescription={adDetails.description}
        variant="hero"
        isHydrated={isHydrated}
      />

      {/* Title */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900 leading-tight">
            {adDetails.title}
          </h1>
          {isOwner && (
            <div className="flex-shrink-0 flex items-center gap-2 mt-1">
              <Link
                href={`/ads/ad-placement?edit=${adDetails.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-primary-600 bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                <IconPencil size={17} stroke={2} />
                {tEdit("editButton")}
              </Link>
              {canDeactivate && (
                <button
                  onClick={handleDeactivateClick}
                  disabled={isDeactivating}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500 bg-white px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-60"
                >
                  {isDeactivating ? (
                    <IconLoader2 size={17} className="animate-spin" />
                  ) : (
                    <IconPower size={17} stroke={2} />
                  )}
                  {tEdit("deactivateButton")}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          {adDetails.price !== null ? (
            <div className="text-3xl sm:text-4xl font-semibold text-gray-900">
              {adDetails.price.toLocaleString()} ₼
            </div>
          ) : (
            <div className="text-xl sm:text-2xl font-medium text-gray-600">
              {t("priceNotApplicable")}
            </div>
          )}
        </div>
      </div>

      {/* Ad Type Badge and Meta Info */}
      <div className="space-y-3 sm:space-y-4">
        {/* Meta Info Tags */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge variant="meta" icon={IconMapPin}>
            {adDetails.cityName}
            {adDetails.districtName ? ` — ${adDetails.districtName}` : ""}
          </Badge>
          <Badge variant="meta" icon={IconEye}>
            {t("views", { count: adDetails.viewCount.toLocaleString() })}
          </Badge>
          <Badge variant="meta" icon={IconClock}>
            {formatDate(adDetails.publishedAt, tDate)}
          </Badge>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      <ConfirmationDialog
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivateConfirm}
        title={tEdit("deactivateModalTitle")}
        message={tEdit("deactivateConfirm")}
        confirmText={tEdit("deactivateButton")}
        cancelText={tEdit("cancelButton")}
        variant="danger"
        isLoading={isDeactivating}
      />
    </div>
  );
}
