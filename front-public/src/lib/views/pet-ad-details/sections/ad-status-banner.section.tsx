"use client";

import { useState } from "react";
import { PetAdStatus } from "@/lib/api/types/pet-ad.types";
import {
  IconClock,
  IconX,
  IconCalendarOff,
  IconRefresh,
  IconLoader2,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { reactivateAdAction } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

interface AdStatusBannerProps {
  status: PetAdStatus;
  rejectionReason?: string | null;
  adId?: number;
  isOwner?: boolean;
}

export function AdStatusBanner({
  status,
  rejectionReason,
  adId,
  isOwner = false,
}: AdStatusBannerProps) {
  const t = useTranslations("petAdDetails.statusBanner");
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const router = useRouter();

  if (status === PetAdStatus.Published) return null;

  const handleRenew = async () => {
    if (!adId || isRenewing) return;
    setIsRenewing(true);
    try {
      const result = await reactivateAdAction(adId);
      if (result.success) {
        setRenewed(true);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        alert(result.error || t("expired.renewError"));
      }
    } catch {
      alert(t("expired.renewError"));
    } finally {
      setIsRenewing(false);
    }
  };

  if (status === PetAdStatus.Pending) {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <IconClock size={18} className="text-amber-600 flex-shrink-0 mt-px" />
        <p className="text-sm text-amber-800">
          <span className="font-medium">{t("pending.title")}</span>
          {" · "}
          {t("pending.description")}
        </p>
      </div>
    );
  }

  if (status === PetAdStatus.Rejected) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <IconX size={18} className="text-red-600 flex-shrink-0 mt-px" />
          <div>
            <p className="text-sm text-red-800">
              <span className="font-medium">{t("rejected.title")}</span>
              {" · "}
              {t("rejected.description")}
            </p>
            {rejectionReason && (
              <p className="text-sm text-red-700 mt-1.5 pl-3 border-l-2 border-red-300">
                {rejectionReason}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === PetAdStatus.Expired) {
    if (renewed) {
      return (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <IconRefresh size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                {t("expired.renewedTitle")}
              </p>
              <p className="text-sm text-green-600 mt-0.5">
                {t("expired.renewedDescription")}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <IconCalendarOff size={20} className="text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-red-800">
              {t("expired.title")}
            </p>
            <p className="text-sm text-red-600/80 mt-0.5">
              {t("expired.description")}
            </p>
          </div>
          {isOwner && (
            <button
              onClick={handleRenew}
              disabled={isRenewing}
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-[0.97] disabled:opacity-60"
            >
              {isRenewing ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <IconRefresh size={16} />
              )}
              {t("expired.renewButton")}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
