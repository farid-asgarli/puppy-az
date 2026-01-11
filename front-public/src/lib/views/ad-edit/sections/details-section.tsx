'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import { IconInfoCircle } from '@tabler/icons-react';

interface DetailsSectionProps {
  formData: {
    title: string;
    description: string;
  };
  onChange: (data: Partial<DetailsSectionProps['formData']>) => void;
  errors?: {
    title?: string;
    description?: string;
  };
}

const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MIN_LENGTH = 30;
const DESCRIPTION_MAX_LENGTH = 2000;

/**
 * Details Section
 * Title and description inputs with character counters and validation
 */
export const DetailsSection = ({ formData, onChange, errors = {} }: DetailsSectionProps) => {
  const t = useTranslations('adEdit.details');

  const handleTitleChange = (value: string) => {
    if (value.length <= TITLE_MAX_LENGTH) {
      onChange({ title: value });
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length <= DESCRIPTION_MAX_LENGTH) {
      onChange({ description: value });
    }
  };

  const handleTitleBlur = () => {
    // Trim whitespace on blur
    onChange({ title: formData.title.trim() });
  };

  const handleDescriptionBlur = () => {
    // Trim whitespace on blur
    onChange({ description: formData.description.trim() });
  };

  // Character count color
  const getTitleCharCountColor = () => {
    if (formData.title.length < TITLE_MAX_LENGTH * 0.8) return 'text-gray-500';
    if (formData.title.length >= TITLE_MAX_LENGTH) return 'text-red-600';
    return 'text-orange-600';
  };

  const getDescriptionCharCountColor = () => {
    if (formData.description.length < DESCRIPTION_MAX_LENGTH * 0.8) return 'text-gray-500';
    if (formData.description.length >= DESCRIPTION_MAX_LENGTH) return 'text-red-600';
    return 'text-orange-600';
  };

  // Validation states
  const isTitleValid = formData.title.trim().length >= TITLE_MIN_LENGTH;
  const isDescriptionValid = formData.description.trim().length >= DESCRIPTION_MIN_LENGTH;
  const titleRemainingChars = TITLE_MIN_LENGTH - formData.title.trim().length;
  const descriptionRemainingChars = DESCRIPTION_MIN_LENGTH - formData.description.trim().length;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <Heading variant="section" as="h2">
          {t('heading')}
        </Heading>
        <Text variant="body" color="secondary">
          {t('subheading')}
        </Text>
      </div>

      {/* Title Field */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label variant="field" htmlFor="title">
            {t('title')}
            <span className="text-red-600 ml-1">{t('titleRequired')}</span>
          </Label>
          <Text variant="small" weight="medium" className={getTitleCharCountColor()} as="span">
            {formData.title.length} / {TITLE_MAX_LENGTH}
          </Text>
        </div>

        <textarea
          id="title"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder={t('titlePlaceholder')}
          rows={2}
          maxLength={TITLE_MAX_LENGTH}
          className={cn(
            'w-full px-4 py-4 rounded-xl border-2 transition-colors text-base resize-none',
            'focus:outline-none',
            errors.title ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-black'
          )}
        />

        {/* Title Validation Messages */}
        {errors.title && (
          <Text variant="small" className="text-red-600">
            {errors.title}
          </Text>
        )}
        {!errors.title && formData.title.length > 0 && !isTitleValid && (
          <Text variant="small" color="secondary">
            {t('titleMinRemaining', { count: titleRemainingChars })}
          </Text>
        )}
        {!errors.title && isTitleValid && formData.title.length >= TITLE_MIN_LENGTH && (
          <Text variant="small" className="text-green-600 flex items-center gap-1">
            <span>✓</span>
            <span>{t('titleMinMet')}</span>
          </Text>
        )}

        {/* Title Tips */}
        <div className="p-4 rounded-xl bg-info-50 border-2 border-info-100">
          <div className="flex gap-3">
            <IconInfoCircle size={20} className="text-info-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-info-900 mb-2">{t('titleTips')}</p>
              <ul className="space-y-1 text-sm text-info-700">
                <li className="flex items-start gap-2">
                  <span className="text-info-400">•</span>
                  <span>{t('titleTip1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info-400">•</span>
                  <span>{t('titleTip2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info-400">•</span>
                  <span>{t('titleTip3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label variant="field" htmlFor="description">
              {t('description')}
              <span className="text-red-600 ml-1">{t('descriptionRequired')}</span>
            </Label>
            <Text variant="small" weight="medium" className={getDescriptionCharCountColor()} as="span">
              {formData.description.length} / {DESCRIPTION_MAX_LENGTH}
            </Text>
          </div>
          <Text variant="small" color="secondary">
            {t('descriptionSubtitle')}
          </Text>
        </div>

        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          onBlur={handleDescriptionBlur}
          placeholder={t('descriptionPlaceholder')}
          rows={12}
          maxLength={DESCRIPTION_MAX_LENGTH}
          className={cn(
            'w-full px-4 py-4 rounded-xl border-2 transition-colors text-base resize-y',
            'focus:outline-none',
            errors.description ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-black'
          )}
        />

        {/* Description Validation Messages */}
        {errors.description && (
          <Text variant="small" className="text-red-600">
            {errors.description}
          </Text>
        )}
        {!errors.description && formData.description.length > 0 && !isDescriptionValid && (
          <Text variant="small" color="secondary">
            {t('descriptionMinRemaining', { count: descriptionRemainingChars })}
          </Text>
        )}
        {!errors.description && isDescriptionValid && formData.description.length >= DESCRIPTION_MIN_LENGTH && (
          <Text variant="small" className="text-green-600 flex items-center gap-1">
            <span>✓</span>
            <span>{t('descriptionMinMet')}</span>
          </Text>
        )}

        {/* Description Tips */}
        <div className="p-4 rounded-xl bg-info-50 border-2 border-info-100">
          <div className="flex gap-3">
            <IconInfoCircle size={20} className="text-info-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-info-900 mb-2">{t('descriptionTips')}</p>
              <ul className="space-y-1 text-sm text-info-700">
                <li className="flex items-start gap-2">
                  <span className="text-info-400">•</span>
                  <span>{t('descriptionTip1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info-400">•</span>
                  <span>{t('descriptionTip2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info-400">•</span>
                  <span>{t('descriptionTip3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info-400">•</span>
                  <span>{t('descriptionTip4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info-400">•</span>
                  <span>{t('descriptionTip5')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
