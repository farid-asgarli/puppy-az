"use client";

import { useState, useEffect, useRef } from "react";
import {
  PetAdDetailsDto,
  PetAdListItemDto,
  PetAdStatus,
  PetCategoryDetailedDto,
} from "@/lib/api/types/pet-ad.types";
import NarrowContainer from "@/lib/components/narrow-container";
import { AdDetailsHeroSection } from "./sections/hero.section";
import { AdDetailsImageGallerySection } from "./sections/image-gallery.section";
import { AdDetailsQuickInfoSection } from "./sections/quick-info.section";
import { AdDetailsDescriptionSection } from "./sections/description.section";
import { AdDetailsContactCardSection } from "./sections/contact-card.section";
import { AdDetailsQuestionsSection } from "./sections/questions.section";
import { AdDetailsStatsSection } from "./sections/stats.section";
import { AdDetailsSimilarAdsSection } from "./sections/related-ads.section";
import { AdDetailsCategoriesSection } from "@/lib/views/pet-ad-details/sections/pet-categories.section";
import { StickyHeaderSection } from "./sections/sticky-header.section";
import { AdStatusBanner } from "./sections/ad-status-banner.section";
import { ActionButtonGroup } from "@/lib/components/views/pet-ad-details/action-button-group";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { recordViewAction } from "@/lib/auth/actions";
import { useAuth } from "@/lib/hooks/use-auth";
import { AdDetailsRecentlyViewedAdsSection } from "@/lib/views/pet-ad-details/sections/recently-viewed.section";
import { petAdService } from "@/lib/api/services/pet-ad.service";

export interface PetAdDetailsViewProps {
  adDetails: PetAdDetailsDto;
  relatedAds: PetAdListItemDto[];
  petCategories: PetCategoryDetailedDto[];
  isInModal?: boolean;
}

export default function PetAdDetailsView({
  adDetails,
  relatedAds,
  petCategories,
  isInModal = false,
}: PetAdDetailsViewProps) {
  const tPrice = useTranslations("petAdDetailsPage.price");
  const tEdit = useTranslations("petAdDetails.statusBanner");
  const locale = useLocale();
  const { isAuthenticated, user } = useAuth();
  const isOwner = isAuthenticated && user?.id === adDetails.owner.id;
  const [isHydrated, setIsHydrated] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const viewRecordedRef = useRef<number | null>(null);
  const viewCountIncrementedRef = useRef<number | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Increment view count when component mounts (for all users including anonymous)
  // Using ref to prevent duplicate calls from React Strict Mode or re-renders
  // Calling API directly from client to avoid server action issues
  useEffect(() => {
    if (viewCountIncrementedRef.current !== adDetails.id) {
      viewCountIncrementedRef.current = adDetails.id;
      petAdService
        .incrementViewCount(adDetails.id, locale)
        .then(() => {
          console.log(
            "View count incremented successfully for ad:",
            adDetails.id,
          );
        })
        .catch((error) => {
          console.error("Failed to increment view count:", error);
        });
    }
  }, [adDetails.id, locale]);

  // Record view for recently viewed tracking (only for authenticated users)
  // Using ref to prevent duplicate calls from React Strict Mode or re-renders
  useEffect(() => {
    if (isAuthenticated && viewRecordedRef.current !== adDetails.id) {
      viewRecordedRef.current = adDetails.id;
      recordViewAction(adDetails.id).catch((error) => {
        console.error("Failed to record view:", error);
      });
    }
  }, [adDetails.id, isAuthenticated]);

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header when scrolled past 400px (roughly after hero + gallery)
      setShowStickyHeader(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header (appears on scroll, hidden on mobile) */}
      <StickyHeaderSection
        adDetails={adDetails}
        isVisible={showStickyHeader}
        isHydrated={isHydrated}
        isInModal={isInModal}
      />

      {/* Mobile Layout (< 768px) - Airbnb style */}
      <div className="md:hidden">
        {/* Navigation Above Gallery */}
        <div className="px-4 py-5">
          <ActionButtonGroup
            adId={adDetails.id}
            adTitle={adDetails.title}
            adDescription={adDetails.description}
            adType={adDetails.adType}
            variant="compact"
            isHydrated={isHydrated}
          />
        </div>

        {/* Status Banner - above gallery so it's immediately visible */}
        {adDetails.status !== PetAdStatus.Published && (
          <div className="px-4 pb-3">
            <AdStatusBanner
              status={adDetails.status}
              rejectionReason={adDetails.rejectionReason}
              adId={adDetails.id}
              isOwner={isOwner}
            />
          </div>
        )}

        {/* Gallery at the very top (no padding) */}
        <AdDetailsImageGallerySection
          images={adDetails.images}
          title={adDetails.title}
        />

        {/* Content with rounded top corners */}
        <div className="bg-white rounded-t-3xl -mt-6 relative z-10">
          <NarrowContainer className="py-6">
            <div className="space-y-6">
              {/* Hero Section (without action buttons) */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-2xl font-semibold font-heading text-gray-900 leading-tight">
                      {adDetails.title}
                    </h1>
                    {isOwner && (
                      <Link
                        href={`/ads/ad-placement?edit=${adDetails.id}`}
                        className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl border border-primary-600 bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-all duration-200"
                      >
                        <IconPencil size={17} stroke={2} />
                        {tEdit("editButton")}
                      </Link>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <div
                      className={`font-semibold text-gray-900 ${adDetails.price === null || adDetails.price === undefined ? "text-xl" : "text-3xl"}`}
                    >
                      {adDetails.price === null || adDetails.price === undefined
                        ? tPrice("negotiable")
                        : adDetails.price === 0
                          ? tPrice("free")
                          : `${adDetails.price.toLocaleString()} ₼`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Cards */}
              <AdDetailsQuickInfoSection adDetails={adDetails} />

              {/* Description */}
              <AdDetailsDescriptionSection
                description={adDetails.description}
              />

              {/* Statistics */}
              <AdDetailsStatsSection adDetails={adDetails} />

              {/* Questions & Answers - Facebook-like comment system */}
              <AdDetailsQuestionsSection
                questions={adDetails.questions}
                adId={adDetails.id}
                ownerId={adDetails.owner.id}
              />

              {/* Related Ads Section */}
              <AdDetailsSimilarAdsSection
                relatedAds={relatedAds}
                categoryId={adDetails.breed?.categoryId}
                categorySlug={relatedAds[0]?.categorySlug}
              />

              {/* Categories Section */}
              <AdDetailsCategoriesSection categories={petCategories} />

              <AdDetailsRecentlyViewedAdsSection />
            </div>
          </NarrowContainer>
        </div>

        {/* Mobile Contact Bar - Sticky Bottom */}
        <AdDetailsContactCardSection
          owner={adDetails.owner}
          contactPhone={adDetails.owner.contactPhoneNumber}
          contactEmail={adDetails.owner.contactEmail}
          price={adDetails.price}
          isMobile={true}
          petAdId={adDetails.id}
          petAdTitle={adDetails.title}
        />
      </div>

      {/* Desktop/Tablet Layout (>= 768px) */}
      <div className="hidden md:block">
        <NarrowContainer className="py-6 sm:py-8">
          {/* Sections */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {/* Hero Section */}
            <AdDetailsHeroSection
              adDetails={adDetails}
              isHydrated={isHydrated}
              isOwner={isOwner}
            />

            {/* Status Banner */}
            {adDetails.status !== PetAdStatus.Published && (
              <AdStatusBanner
                status={adDetails.status}
                rejectionReason={adDetails.rejectionReason}
                adId={adDetails.id}
                isOwner={isOwner}
              />
            )}

            {/* Image Gallery */}
            <AdDetailsImageGallerySection
              images={adDetails.images}
              title={adDetails.title}
            />

            {/* Grid Layout: Main Content + Sidebar */}
            <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Quick Info Cards */}
                <AdDetailsQuickInfoSection adDetails={adDetails} />

                {/* Description */}
                <AdDetailsDescriptionSection
                  description={adDetails.description}
                />

                {/* Statistics */}
                <AdDetailsStatsSection adDetails={adDetails} />

                {/* Questions & Answers */}
                <AdDetailsQuestionsSection
                  questions={adDetails.questions}
                  adId={adDetails.id}
                  ownerId={adDetails.owner.id}
                />
              </div>

              {/* Sidebar Column (Desktop only) */}
              <div className="hidden lg:block lg:col-span-1">
                <div ref={contactSectionRef} className="sticky top-24">
                  <AdDetailsContactCardSection
                    owner={adDetails.owner}
                    contactPhone={adDetails.owner.contactPhoneNumber}
                    contactEmail={adDetails.owner.contactEmail}
                    price={adDetails.price}
                    isMobile={false}
                    petAdId={adDetails.id}
                    petAdTitle={adDetails.title}
                  />
                </div>
              </div>
            </div>

            {/* Related Ads Section */}
            <AdDetailsSimilarAdsSection
              relatedAds={relatedAds}
              categoryId={adDetails.breed?.categoryId}
              categorySlug={relatedAds[0]?.categorySlug}
            />

            {/* Categories Section */}
            <AdDetailsCategoriesSection categories={petCategories} />

            <AdDetailsRecentlyViewedAdsSection />
          </div>
        </NarrowContainer>
      </div>
    </div>
  );
}
