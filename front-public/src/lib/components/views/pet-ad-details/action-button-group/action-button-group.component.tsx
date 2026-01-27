"use client";

import { cn } from "@/lib/external/utils";
import {
  IconHeart,
  IconHeartFilled,
  IconShare,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { ActionButtonGroupProps } from "./action-button-group.types";
import { getAdTypes } from "@/lib/utils/mappers";
import { Badge } from "@/lib/components/views/pet-ad-details/badge";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { showToast } from "@/lib/utils/toast";
import { useRouter } from "@/i18n";

/**
 * ActionButtonGroup Component
 *
 * Reusable group of action buttons for pet ad details:
 * - Back/Close button (optional)
 * - Ad Type Badge (optional)
 * - Favorite toggle button
 * - Share button
 *
 * Supports multiple variants for different contexts (hero, sticky header, compact)
 */
export function ActionButtonGroup({
  adId,
  adTitle,
  adDescription,
  adType,
  variant = "hero",
  isHydrated = true,
  className,
}: ActionButtonGroupProps) {
  const t = useTranslations("common");
  const tAccessibility = useTranslations("accessibility");
  const tClipboard = useTranslations("common.clipboard");
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const adTypes = getAdTypes(t);

  // Determine if back button should be shown
  const isLiked = isHydrated ? isFavorite(adId) : false;
  const adTypeData = adType ? adTypes[adType] : null;

  // Handlers
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleLike = async () => {
    try {
      await toggleFavorite(adId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: adTitle,
          text: adDescription,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
          // Fallback to clipboard if share failed
          await handleCopyToClipboard();
        }
      }
    } else {
      // Fallback: Copy to clipboard
      await handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      showToast.success(tClipboard("linkCopied"));
    } else {
      showToast.error(tClipboard("copyFailed"));
    }
  };

  // Variant-specific styles
  const getButtonStyles = () => {
    switch (variant) {
      case "sticky":
        return {
          container: "flex items-center gap-2",
          button: "w-10 h-10 rounded-lg border-2",
          backButton:
            "w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400",
          iconSize: 18,
        };
      case "compact":
        return {
          container: "flex items-center gap-2",
          button: "w-10 h-10 rounded-xl border-2",
          backButton:
            "w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-gray-400",
          iconSize: 18,
        };
      case "hero":
      default:
        return {
          container: "flex items-center justify-between gap-4",
          button: "w-11 h-11 rounded-xl border-2",
          backButton: cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-xl",
            "border-2 border-gray-200 hover:border-gray-400",
            "text-gray-700 font-medium transition-all duration-200",
          ),
          iconSize: 20,
        };
    }
  };

  const styles = getButtonStyles();

  return (
    <div className={cn(styles.container, className)}>
      {/* Back Button - shown in compact variant */}
      {variant === "compact" && (
        <button
          onClick={handleBack}
          className={cn(
            styles.button,
            "border-gray-200 bg-white text-gray-600",
            "hover:border-gray-400 flex items-center justify-center transition-all duration-200",
          )}
          aria-label={t("back")}
        >
          <IconArrowLeft size={styles.iconSize} />
        </button>
      )}

      {/* Ad Type Badge (shown in hero variant when adType is provided) */}
      {variant === "hero" && adTypeData && (
        <Badge
          variant="ad-type"
          icon={adTypeData?.icon}
          color={{
            text: adTypeData?.color.text,
            bg: adTypeData?.color.bg,
          }}
        >
          {adTypeData.title}
        </Badge>
      )}

      {/* Ad Type Badge (shown in compact variant when adType is provided) */}
      {variant === "compact" && adTypeData && (
        <Badge
          variant="ad-type"
          size="sm"
          icon={adTypeData?.icon}
          color={{
            text: adTypeData?.color.text,
            bg: adTypeData?.color.bg,
          }}
        >
          {adTypeData.title}
        </Badge>
      )}

      {/* Action Buttons Group */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Favorite Button */}
        <button
          onClick={handleLike}
          className={cn(
            styles.button,
            "flex items-center justify-center transition-all duration-200",
            isLiked
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-white border-gray-200 text-gray-600 hover:border-gray-400",
          )}
          aria-label={
            isLiked
              ? tAccessibility("removeFromFavorites")
              : tAccessibility("addToFavorites")
          }
        >
          {isLiked ? (
            <IconHeartFilled size={styles.iconSize} />
          ) : (
            <IconHeart size={styles.iconSize} />
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className={cn(
            styles.button,
            "border-gray-200 bg-white text-gray-600",
            "hover:border-gray-400 flex items-center justify-center transition-all duration-200",
          )}
          aria-label={tAccessibility("share")}
        >
          <IconShare size={styles.iconSize} />
        </button>
      </div>
    </div>
  );
}
