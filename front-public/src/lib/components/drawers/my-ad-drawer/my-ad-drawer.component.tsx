'use client';

import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { IconX, IconEdit, IconTrash, IconEye, IconClock, IconTrendingUp, IconCircleCheck, IconAlertCircle } from '@tabler/icons-react';
import { MyPetAdDto, PetAdStatus } from '@/lib/api/types/pet-ad.types';
import { getMyPetAdAction } from '@/lib/auth/actions';
import { cn } from '@/lib/external/utils';
import { useTranslations } from 'next-intl';
import Button from '@/lib/primitives/button/button.component';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import { ImageWithFallback } from '@/lib/primitives';

interface MyAdDrawerProps {
  adId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: number) => void;
  onCloseAd?: (id: number) => void;
  onDelete?: (id: number) => void;
}

/**
 * MyAdDrawer - Detailed view of user's pet ad
 * Displays full information fetched from getMyPetAd endpoint
 * Status-dependent actions and information
 */
export function MyAdDrawer({ adId, isOpen, onClose, onEdit, onCloseAd, onDelete }: MyAdDrawerProps) {
  const t = useTranslations('myAds.drawer');
  const [adData, setAdData] = useState<MyPetAdDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ad data when drawer opens
  useEffect(() => {
    if (!isOpen || !adId) {
      setAdData(null);
      setError(null);
      return;
    }

    const fetchAdData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMyPetAdAction(adId);
        if (result.success && result.data) {
          setAdData(result.data);
        } else {
          setError(t('loadError'));
        }
      } catch (err) {
        setError(t('loadError'));
        console.error('Failed to load ad data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdData();
  }, [adId, isOpen, t]);

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

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[24px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          {/* Drag Handle */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4 mb-2" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Drawer.Title asChild>
              <Heading variant="card" as="h2">
                {t('title')}
              </Heading>
            </Drawer.Title>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <IconX size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-64 px-6">
                <IconAlertCircle size={48} className="text-red-500 mb-4" />
                <Text variant="body" color="secondary" className="text-center">
                  {error}
                </Text>
              </div>
            )}

            {adData && (
              <div className="pb-6">
                {/* Image Gallery */}
                {adData.images && adData.images.length > 0 && (
                  <div className="relative aspect-[16/9] bg-gray-100 mb-6">
                    <ImageWithFallback src={adData.images[0].url} alt={adData.title} fill className="object-cover" />
                    {adData.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                        <Text variant="small" weight="medium" className="text-white">
                          1 / {adData.images.length}
                        </Text>
                      </div>
                    )}
                  </div>
                )}

                <div className="px-6 space-y-6">
                  {/* Status & Premium Badge */}
                  <div className="flex items-center gap-2">
                    {currentStatus && StatusIcon && (
                      <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full', currentStatus.bgColor)}>
                        <StatusIcon size={16} strokeWidth={2.5} className={currentStatus.color} />
                        <Label variant="badge" as="span" className={currentStatus.color}>
                          {currentStatus.label}
                        </Label>
                      </div>
                    )}
                    {adData.isPremium && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full">
                        <IconTrendingUp size={16} strokeWidth={2.5} className="text-yellow-900" />
                        <Label variant="badge" as="span" className="text-yellow-900">
                          {t('premium')}
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <Heading variant="subsection" as="h2" className="mb-2">
                      {adData.title}
                    </Heading>
                    {adData.price !== null ? (
                      <Text variant="body-xl" weight="bold" className="text-3xl">
                        {adData.price}{' '}
                        <Text as="span" variant="body-lg" color="tertiary">
                          AZN
                        </Text>
                      </Text>
                    ) : (
                      <Text variant="body-lg" color="muted">
                        {t('noPrice')}
                      </Text>
                    )}
                  </div>

                  {/* Meta Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label variant="field" as="p" className="mb-1">
                        {t('category')}
                      </Label>
                      <Label variant="value">{adData.categoryTitle}</Label>
                    </div>
                    <div>
                      <Label variant="field" as="p" className="mb-1">
                        {t('breed')}
                      </Label>
                      <Label variant="value">{adData.breed.title}</Label>
                    </div>
                    <div>
                      <Label variant="field" as="p" className="mb-1">
                        {t('location')}
                      </Label>
                      <Label variant="value">{adData.cityName}</Label>
                    </div>
                    <div>
                      <Label variant="field" as="p" className="mb-1">
                        {t('age')}
                      </Label>
                      <Label variant="value">
                        {adData.ageInMonths} {t('months')}
                      </Label>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="flex items-center gap-6 py-4 border-y border-gray-200">
                    <div className="flex items-center gap-2">
                      <IconEye size={20} className="text-gray-400" />
                      <div>
                        <Text variant="body-xl" weight="bold" className="text-2xl">
                          {adData.viewCount}
                        </Text>
                        <Text variant="tiny" color="tertiary">
                          {t('views')}
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Heading variant="label" as="h3" className="mb-3">
                      {t('description')}
                    </Heading>
                    <Text variant="body" leading="relaxed" className="whitespace-pre-wrap">
                      {adData.description}
                    </Text>
                  </div>

                  {/* Rejection Reason (if applicable) */}
                  {adData.status === PetAdStatus.Rejected && adData.rejectionReason && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <Label variant="badge" as="p" className="text-red-900 mb-2">
                        {t('rejectionReason')}
                      </Label>
                      <Text variant="small" className="text-red-700">
                        {adData.rejectionReason}
                      </Text>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <Label variant="field" as="p" className="mb-1">
                        {t('gender')}
                      </Label>
                      <Label variant="value">{adData.gender === 1 ? t('male') : t('female')}</Label>
                    </div>
                    <div>
                      <Label variant="field" as="p" className="mb-1">
                        {t('color')}
                      </Label>
                      <Label variant="value">{adData.color}</Label>
                    </div>
                    {adData.weight && (
                      <div>
                        <Label variant="field" as="p" className="mb-1">
                          {t('weight')}
                        </Label>
                        <Label variant="value">
                          {adData.weight} {t('kg')}
                        </Label>
                      </div>
                    )}
                    {adData.size && (
                      <div>
                        <Label variant="field" as="p" className="mb-1">
                          {t('size')}
                        </Label>
                        <Label variant="value">{t(`sizes.${adData.size}`)}</Label>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="text-sm text-gray-500 space-y-1">
                    <Text variant="small" color="tertiary">
                      {t('created')}: {new Date(adData.createdAt).toLocaleDateString()}
                    </Text>
                    {adData.publishedAt && (
                      <Text variant="small" color="tertiary">
                        {t('published')}: {new Date(adData.publishedAt).toLocaleDateString()}
                      </Text>
                    )}
                    {adData.expiresAt && (
                      <Text variant="small" color="tertiary">
                        {t('expires')}: {new Date(adData.expiresAt).toLocaleDateString()}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions Footer */}
          {adData && (
            <div className="border-t border-gray-200 p-6 bg-white">
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
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
