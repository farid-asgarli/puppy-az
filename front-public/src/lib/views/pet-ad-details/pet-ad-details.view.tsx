'use client';

import { useState, useEffect, useRef } from 'react';
import { PetAdDetailsDto, PetAdListItemDto, PetCategoryDetailedDto } from '@/lib/api/types/pet-ad.types';
import { IconCrown } from '@tabler/icons-react';
import NarrowContainer from '@/lib/components/narrow-container';
import { AdDetailsHeroSection } from './sections/hero.section';
import { AdDetailsImageGallerySection } from './sections/image-gallery.section';
import { AdDetailsQuickInfoSection } from './sections/quick-info.section';
import { AdDetailsDescriptionSection } from './sections/description.section';
import { AdDetailsContactCardSection } from './sections/contact-card.section';
import { AdDetailsQuestionsSection } from './sections/questions.section';
import { AdDetailsStatsSection } from './sections/stats.section';
import { AdDetailsSimilarAdsSection } from './sections/related-ads.section';
import { AdDetailsCategoriesSection } from '@/lib/views/pet-ad-details/sections/pet-categories.section';
import { StickyHeaderSection } from './sections/sticky-header.section';
import { ActionButtonGroup } from '@/lib/components/views/pet-ad-details/action-button-group';
import { useTranslations } from 'next-intl';
import { recordViewAction } from '@/lib/auth/actions';
import { useAuth } from '@/lib/hooks/use-auth';
import { AdDetailsRecentlyViewedAdsSection } from '@/lib/views/pet-ad-details/sections/recently-viewed.section';

export interface PetAdDetailsViewProps {
  adDetails: PetAdDetailsDto;
  relatedAds: PetAdListItemDto[];
  petCategories: PetCategoryDetailedDto[];
  isInModal?: boolean;
}

export default function PetAdDetailsView({ adDetails, relatedAds, petCategories, isInModal = false }: PetAdDetailsViewProps) {
  const t = useTranslations('petAdDetailsPage.premium');
  const tPrice = useTranslations('petAdDetailsPage.price');
  const { isAuthenticated } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Record view when component mounts (only for authenticated users)
  useEffect(() => {
    if (isAuthenticated) {
      recordViewAction(adDetails.id).catch((error) => {
        console.error('Failed to record view:', error);
      });
    }
  }, [adDetails.id, isAuthenticated]);

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header when scrolled past 400px (roughly after hero + gallery)
      setShowStickyHeader(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header (appears on scroll, hidden on mobile) */}
      <StickyHeaderSection adDetails={adDetails} isVisible={showStickyHeader} isHydrated={isHydrated} isInModal={isInModal} />

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

        {/* Gallery at the very top (no padding) */}
        <AdDetailsImageGallerySection images={adDetails.images} title={adDetails.title} />

        {/* Content with rounded top corners */}
        <div className="bg-white rounded-t-3xl -mt-6 relative z-10">
          <NarrowContainer className="py-6">
            <div className="space-y-6">
              {/* Hero Section (without action buttons) */}
              <div className="space-y-4">
                {/* Title and Premium Badge */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <h1 className="flex-1 text-2xl font-semibold font-heading text-gray-900 leading-tight">{adDetails.title}</h1>
                    {adDetails.isPremium && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-premium-500 text-white text-xs font-medium flex-shrink-0">
                        <IconCrown size={14} />
                        <span>{t('badge')}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    {adDetails.price !== null ? (
                      <div className="text-3xl font-semibold text-gray-900">{adDetails.price.toLocaleString()} ₼</div>
                    ) : (
                      <div className="text-xl font-medium text-gray-600">{tPrice('notApplicable')}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Info Cards */}
              <AdDetailsQuickInfoSection adDetails={adDetails} />

              {/* Description */}
              <AdDetailsDescriptionSection description={adDetails.description} />

              {/* Questions & Answers */}
              <AdDetailsQuestionsSection questions={adDetails.questions} adId={adDetails.id} ownerId={adDetails.owner.id} />

              {/* Statistics */}
              <AdDetailsStatsSection adDetails={adDetails} />

              {/* Related Ads Section */}
              <AdDetailsSimilarAdsSection relatedAds={relatedAds} categoryId={adDetails.breed.categoryId} />

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
        />
      </div>

      {/* Desktop/Tablet Layout (>= 768px) */}
      <div className="hidden md:block">
        <NarrowContainer className="py-6 sm:py-8">
          {/* Sections */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {/* Hero Section */}
            <AdDetailsHeroSection adDetails={adDetails} isHydrated={isHydrated} />

            {/* Image Gallery */}
            <AdDetailsImageGallerySection images={adDetails.images} title={adDetails.title} />

            {/* Grid Layout: Main Content + Sidebar */}
            <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Quick Info Cards */}
                <AdDetailsQuickInfoSection adDetails={adDetails} />

                {/* Description */}
                <AdDetailsDescriptionSection description={adDetails.description} />

                {/* Questions & Answers */}
                <AdDetailsQuestionsSection questions={adDetails.questions} adId={adDetails.id} ownerId={adDetails.owner.id} />

                {/* Statistics */}
                <AdDetailsStatsSection adDetails={adDetails} />
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
                  />
                </div>
              </div>
            </div>

            {/* Related Ads Section */}
            <AdDetailsSimilarAdsSection relatedAds={relatedAds} categoryId={adDetails.breed.categoryId} />

            {/* Categories Section */}
            <AdDetailsCategoriesSection categories={petCategories} />

            <AdDetailsRecentlyViewedAdsSection />
          </div>
        </NarrowContainer>
      </div>
    </div>
  );
}
