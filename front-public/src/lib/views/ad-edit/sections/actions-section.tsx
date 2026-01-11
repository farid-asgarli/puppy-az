'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Heading, Text } from '@/lib/primitives/typography';
import { Button } from '@/lib/primitives';
import { IconDeviceFloppy, IconX, IconEye, IconTrash, IconAlertTriangle } from '@tabler/icons-react';

interface ActionsSectionProps {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onPreview: () => void;
  onDelete?: () => void;
  saveError?: string | null;
}

/**
 * Actions Section
 * Save/Cancel buttons, Preview, Delete ad (danger zone)
 */
export const ActionsSection = ({ hasChanges, isSaving, onSave, onCancel, onPreview, onDelete, saveError }: ActionsSectionProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const t = useTranslations('adEdit.actions');

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.();
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-12">
      {/* Save Error */}
      {saveError && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex gap-3">
            <IconAlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900 mb-1">{t('errorOccurred')}</p>
              <p className="text-sm text-red-700">{saveError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Actions */}
      <div className="space-y-6">
        {/* Save & Cancel Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onSave}
            disabled={!hasChanges || isSaving}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <IconDeviceFloppy size={20} />
            <span>{isSaving ? t('saving') : t('saveChanges')}</span>
          </Button>

          <Button variant="secondary" size="lg" onClick={onCancel} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2">
            <IconX size={20} />
            <span>{t('cancel')}</span>
          </Button>
        </div>

        {/* Preview Button */}
        <Button variant="outline" size="lg" onClick={onPreview} disabled={isSaving} className="w-full flex items-center justify-center gap-2">
          <IconEye size={20} />
          <span>{t('preview')}</span>
        </Button>

        {/* Changes Indicator */}
        {hasChanges && (
          <div className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 text-center">
              <span className="font-medium">{t('unsavedChanges')}</span> {t('unsavedChangesNote')}
            </p>
          </div>
        )}

        {!hasChanges && !isSaving && (
          <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 text-center">{t('allChangesSaved')}</p>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      {onDelete && (
        <div className="pt-8 border-t-2 border-gray-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <Heading variant="card" as="h3" className="text-red-600">
                {t('dangerZone')}
              </Heading>
              <Text variant="body" color="secondary">
                {t('dangerZoneWarning')}
              </Text>
            </div>

            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                size="lg"
                onClick={handleDeleteClick}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                <IconTrash size={20} />
                <span>{t('deleteAd')}</span>
              </Button>
            ) : (
              <div className="space-y-4 p-6 bg-red-50 border-2 border-red-300 rounded-xl">
                <div className="flex gap-3">
                  <IconAlertTriangle size={24} className="text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900 mb-2">{t('deleteConfirm')}</p>
                    <p className="text-sm text-red-700 mb-4">{t('deleteWarning')}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 flex items-center justify-center gap-2"
                  >
                    <IconTrash size={18} />
                    <span>{t('confirmDelete')}</span>
                  </Button>
                  <Button variant="secondary" size="md" onClick={handleDeleteCancel} className="flex-1">
                    {t('cancelDelete')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsSection;
