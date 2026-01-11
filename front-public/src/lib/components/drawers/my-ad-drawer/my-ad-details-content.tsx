'use client';

import {
  IconX,
  IconEdit,
  IconTrash,
  IconEye,
  IconClock,
  IconTrendingUp,
  IconCircleCheck,
  IconAlertCircle,
  IconExternalLink,
} from '@tabler/icons-react';
import { MyPetAdDto, PetAdStatus } from '@/lib/api/types/pet-ad.types';
import { cn } from '@/lib/external/utils';
import { useTranslations } from 'next-intl';
import Button from '@/lib/primitives/button/button.component';
import { ImageCarousel } from '@/lib/components/image-carousel';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import TransitionLink from '@/lib/components/transition-link';

interface MyAdDetailsContentProps {
  adData: MyPetAdDto | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onEdit?: (id: number) => void;
  onCloseAd?: (id: number) => void;
  onDelete?: (id: number) => void;
  showCloseButton?: boolean;
}

/**
 * MyAdDetailsContent - Shared content for both Dialog and Drawer
 * Displays full ad information with status-dependent actions
 */
export function MyAdDetailsContent({
  adData,
  isLoading,
  error,
  onClose,
  onEdit,
  onCloseAd,
  onDelete,
  showCloseButton = true,
}: MyAdDetailsContentProps) {
  const t = useTranslations('myAds.drawer');

  // Status configuration
  const statusConfig = {
    [PetAdStatus.Pending]: {
      icon: IconClock,
      label: t('status.pending'),
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    [PetAdStatus.Published]: {
      icon: IconCircleCheck,
      label: t('status.published'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    [PetAdStatus.Rejected]: {
      icon: IconAlertCircle,
      label: t('status.rejected'),
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    [PetAdStatus.Expired]: {
      icon: IconClock,
      label: t('status.expired'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    [PetAdStatus.Closed]: {
      icon: IconAlertCircle,
      label: t('status.closed'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    [PetAdStatus.Draft]: {
      icon: IconClock,
      label: t('status.draft'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  };

  const currentStatus = adData ? statusConfig[adData.status] : null;
  const StatusIcon = currentStatus?.icon;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-6">
        <IconAlertCircle size={48} className="text-red-500 mb-4" />
        <Text variant="body" color="secondary" className="text-center">
          {error}
        </Text>
      </div>
    );
  }

  if (!adData) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <Heading variant="card" as="h2">
          {t('title')}
        </Heading>
        {showCloseButton && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <IconX size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="pb-6 px-1">
          {/* Image Gallery with Embla Carousel */}
          {adData.images && adData.images.length > 0 && (
            <ImageCarousel
              images={adData.images.map((img) => ({
                id: img.id,
                url: img.url,
                isPrimary: img.isPrimary,
              }))}
              title={adData.title}
              galleryId="ad-gallery"
              aspectRatio="16/9"
              showCounter={false}
            />
          )}

          <div className="px-3 space-y-8">
            {/* Status & Premium Badge */}
            <div className="flex flex-wrap items-center gap-2 my-4">
              {currentStatus && StatusIcon && (
                <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm', currentStatus.bgColor)}>
                  <StatusIcon size={16} strokeWidth={2.5} className={currentStatus.color} />
                  <Label variant="badge" as="span" className={currentStatus.color}>
                    {currentStatus.label}
                  </Label>
                </div>
              )}
              {adData.isPremium && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-sm">
                  <IconTrendingUp size={16} strokeWidth={2.5} className="text-yellow-900" />
                  <Label variant="badge" as="span" className="text-yellow-900">
                    {t('premium')}
                  </Label>
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div className="space-y-3">
              <Heading variant="subsection" as="h3">
                {adData.title}
              </Heading>
              {adData.price !== null ? (
                <Text variant="body-xl" weight="bold" className="text-3xl md:text-4xl">
                  {adData.price.toLocaleString()}{' '}
                  <Text as="span" variant="body-lg" color="tertiary">
                    AZN
                  </Text>
                </Text>
              ) : (
                <Text variant="body-lg" color="muted" weight="medium">
                  {t('noPrice')}
                </Text>
              )}
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-5 py-5 bg-gray-50 rounded-xl p-4">
              <div>
                <Label variant="badge" as="p" className="text-gray-500 mb-1.5 uppercase tracking-wide">
                  {t('category')}
                </Label>
                <Label variant="value">{adData.categoryTitle}</Label>
              </div>
              <div>
                <Label variant="badge" as="p" className="text-gray-500 mb-1.5 uppercase tracking-wide">
                  {t('breed')}
                </Label>
                <Label variant="value">{adData.breed.title}</Label>
              </div>
              <div>
                <Label variant="badge" as="p" className="text-gray-500 mb-1.5 uppercase tracking-wide">
                  {t('location')}
                </Label>
                <Label variant="value">{adData.cityName}</Label>
              </div>
              <div>
                <Label variant="badge" as="p" className="text-gray-500 mb-1.5 uppercase tracking-wide">
                  {t('age')}
                </Label>
                <Label variant="value">
                  {adData.ageInMonths} {t('months')}
                </Label>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex items-center gap-6 py-5 px-4 bg-gradient-to-r from-info-50 to-info-50 rounded-xl border border-info-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-info-500 rounded-xl flex items-center justify-center">
                  <IconEye size={24} className="text-white" />
                </div>
                <div>
                  <Text variant="body-xl" weight="bold" className="text-2xl">
                    {adData.viewCount.toLocaleString()}
                  </Text>
                  <Text variant="small" weight="medium" color="secondary">
                    {t('views')}
                  </Text>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Heading variant="label" as="h3">
                {t('description')}
              </Heading>
              <Text variant="body" leading="relaxed" className="whitespace-pre-wrap">
                {adData.description}
              </Text>
            </div>

            {/* Rejection Reason (if applicable) */}
            {adData.status === PetAdStatus.Rejected && adData.rejectionReason && (
              <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm">
                <Label variant="badge" as="p" className="text-red-900 mb-2 uppercase tracking-wide">
                  {t('rejectionReason')}
                </Label>
                <Text variant="small" leading="relaxed" className="text-red-700">
                  {adData.rejectionReason}
                </Text>
              </div>
            )}

            {/* Additional Details */}
            <div className="space-y-4">
              <Heading variant="label" as="h4">
                {t('additionalDetails')}
              </Heading>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <Label variant="badge" as="p" className="text-gray-500 mb-1.5 uppercase tracking-wide">
                    {t('gender')}
                  </Label>
                  <Label variant="value">{adData.gender === 1 ? t('male') : t('female')}</Label>
                </div>
                <div>
                  <Label variant="badge" as="p" className="text-gray-500 mb-1.5 uppercase tracking-wide">
                    {t('color')}
                  </Label>
                  <Label variant="value">{adData.color}</Label>
                </div>
                {adData.weight && (
                  <div>
                    <Label variant="badge" as="p" className="text-gray-500 mb-1.5 uppercase tracking-wide">
                      {t('weight')}
                    </Label>
                    <Label variant="value">
                      {adData.weight} {t('kg')}
                    </Label>
                  </div>
                )}
                {adData.size && (
                  <div>
                    <Label variant="badge" as="p" className="text-gray-500 mb-1.5 uppercase tracking-wide">
                      {t('size')}
                    </Label>
                    <Label variant="value">{t(`sizes.${adData.size}`)}</Label>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="pt-4 border-t border-gray-200">
              <Heading variant="label" as="h4" className="mb-3">
                {t('timeline')}
              </Heading>
              <div className="space-y-2">
                <Text variant="small" color="secondary" className="flex justify-between">
                  <Text as="span" weight="medium">
                    {t('created')}:
                  </Text>
                  <Text as="span">{new Date(adData.createdAt).toLocaleDateString()}</Text>
                </Text>
                {adData.publishedAt && (
                  <Text variant="small" color="secondary" className="flex justify-between">
                    <Text as="span" weight="medium">
                      {t('published')}:
                    </Text>
                    <Text as="span">{new Date(adData.publishedAt).toLocaleDateString()}</Text>
                  </Text>
                )}
                {adData.expiresAt && (
                  <Text variant="small" color="secondary" className="flex justify-between">
                    <Text as="span" weight="medium">
                      {t('expires')}:
                    </Text>
                    <Text as="span">{new Date(adData.expiresAt).toLocaleDateString()}</Text>
                  </Text>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <div className="flex flex-col gap-3">
          {/* View Public Page - only for published ads */}
          {adData.status === PetAdStatus.Published && (
            <TransitionLink href={`/ads/item-details/${adData.id}`} className="w-full">
              <Button variant="solid" size="lg" leftSection={<IconExternalLink size={18} />} className="w-full">
                {t('viewPublicPage', { defaultValue: 'View Public Page' })}
              </Button>
            </TransitionLink>
          )}

          <div className="flex gap-3">
            {/* Edit button - available for all statuses except closed */}
            {adData.status !== PetAdStatus.Closed && onEdit && (
              <Button
                variant="outline"
                size="lg"
                leftSection={<IconEdit size={18} />}
                onClick={() => {
                  onEdit(adData.id);
                  onClose();
                }}
                className="flex-1"
              >
                {t('edit')}
              </Button>
            )}

            {/* Close button - only for published ads */}
            {adData.status === PetAdStatus.Published && onCloseAd && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  onCloseAd(adData.id);
                  onClose();
                }}
                className="flex-1"
              >
                {t('closeAd')}
              </Button>
            )}

            {/* Delete button - for rejected or draft ads */}
            {(adData.status === PetAdStatus.Rejected || adData.status === PetAdStatus.Draft) && onDelete && (
              <Button
                variant="danger"
                size="lg"
                leftSection={<IconTrash size={18} />}
                onClick={() => {
                  onDelete(adData.id);
                  onClose();
                }}
                className="flex-1"
              >
                {t('delete')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
