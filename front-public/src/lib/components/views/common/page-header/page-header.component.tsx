"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import NarrowContainer from "@/lib/components/narrow-container";
import { Heading, Text } from "@/lib/primitives/typography";
import type { PageHeaderProps, PageHeaderMaxWidth } from "./page-header.types";
import { Row } from "@/lib/primitives";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const maxWidthClasses: Record<PageHeaderMaxWidth, string> = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  "2xl": "max-w-5xl",
  "3xl": "max-w-6xl",
  full: "max-w-full",
};

/**
 * Page Header Component
 * Standardized header with title, subtitle, and optional back button
 * Used across multiple page types for consistency
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  maxWidth = "md",
  showBackButton = false,
  className,
}) => {
  const router = useRouter();
  const t = useTranslations("common");
  const useNarrowContainer = maxWidth === "md";
  const containerClasses = useNarrowContainer
    ? ""
    : cn(maxWidthClasses[maxWidth], "mx-auto px-6");

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const content = (
    <div className="space-y-3">
      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors -ml-1 group"
        >
          <IconArrowLeft
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>{t("back")}</span>
        </button>
      )}

      <Row justify="between" align="center">
        {/* Title & Subtitle */}
        <div className="space-y-1 sm:space-y-2">
          <Heading
            variant="page-title"
            className="text-2xl sm:text-3xl lg:text-4xl"
          >
            {title}
          </Heading>
          <Text variant="body-lg" className="text-base sm:text-lg">
            {subtitle}
          </Text>
        </div>

        {actions && (
          <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            {actions && (
              <div className="flex items-center gap-2 sm:gap-3">{actions}</div>
            )}
          </div>
        )}
      </Row>
    </div>
  );

  return (
    <div className={cn("border-b border-gray-200", className)}>
      {useNarrowContainer ? (
        <NarrowContainer className="py-6 sm:py-8">{content}</NarrowContainer>
      ) : (
        <div className={cn(containerClasses, "py-6 sm:py-8")}>{content}</div>
      )}
    </div>
  );
};

export default PageHeader;
