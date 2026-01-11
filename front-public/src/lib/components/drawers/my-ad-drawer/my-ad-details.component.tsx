'use client';

import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { Dialog, DialogContent, DialogTitle } from '@/lib/external/components/ui/dialog';
import { MyPetAdDto } from '@/lib/api/types/pet-ad.types';
import { getMyPetAdAction } from '@/lib/auth/actions';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { MyAdDetailsContent } from './my-ad-details-content';

interface MyAdDetailsProps {
  adId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: number) => void;
  onCloseAd?: (id: number) => void;
  onDelete?: (id: number) => void;
}

/**
 * MyAdDetails - Responsive component for displaying ad details
 * - Desktop (≥768px): Modal dialog
 * - Mobile (<768px): Bottom drawer
 */
export function MyAdDetails({ adId, isOpen, onClose, onEdit, onCloseAd, onDelete }: MyAdDetailsProps) {
  const t = useTranslations('myAds.drawer');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [adData, setAdData] = useState<MyPetAdDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ad data when component opens
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

  // Handle dialog close - prevent closing if Fancybox is open
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Check if Fancybox is currently open
      const fancyboxOpen = document.querySelector('.fancybox__container');
      if (fancyboxOpen) {
        // Fancybox is open, don't close the dialog
        return;
      }
      onClose();
    }
  };

  // Desktop: Render as Dialog
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
          {/* Hidden DialogTitle for accessibility */}
          <DialogTitle className="sr-only">{t('title')}</DialogTitle>

          <MyAdDetailsContent
            adData={adData}
            isLoading={isLoading}
            error={error}
            onClose={onClose}
            onEdit={onEdit}
            onCloseAd={onCloseAd}
            onDelete={onDelete}
            showCloseButton={true}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: Render as Drawer
  return (
    <Drawer.Root open={isOpen} onOpenChange={handleDialogChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[24px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          {/* Drag Handle */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4 mb-2" />

          <MyAdDetailsContent
            adData={adData}
            isLoading={isLoading}
            error={error}
            onClose={onClose}
            onEdit={onEdit}
            onCloseAd={onCloseAd}
            onDelete={onDelete}
            showCloseButton={true}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
