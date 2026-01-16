'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { PetAdImageDto } from '@/lib/api/types/pet-ad.types';
import { petAdService } from '@/lib/api/services/pet-ad.service';
import { deletePetAdImageAction } from '@/lib/auth/actions';
import { cn } from '@/lib/external/utils';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import { IconCamera, IconTrash, IconChevronLeft, IconChevronRight, IconStar } from '@tabler/icons-react';
import { useLocale } from '@/lib/hooks/use-client-locale';

interface PhotosSectionProps {
  existingImages: PetAdImageDto[];
  onChange: (data: { imageIds: number[] }) => void;
  onImageUpdate?: (images: PetAdImageDto[]) => void;
  errors?: {
    imageIds?: string;
  };
  token: string;
}

const MAX_PHOTOS = 10;
const MIN_PHOTOS = 1;

/**
 * Photos Section
 * Display existing photos, upload new ones, reorder, delete, set primary
 */
export const PhotosSection = ({ existingImages, onChange, onImageUpdate, errors = {}, token }: PhotosSectionProps) => {
  const t = useTranslations('adEdit.photosSection');
  const locale = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<PetAdImageDto[]>(existingImages);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: boolean }>({});

  // Handle file selection and immediate upload
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      // Check if adding these files would exceed max
      if (images.length + files.length > MAX_PHOTOS) {
        setUploadError(t('errorMaxPhotos', { maxPhotos: MAX_PHOTOS }));
        return;
      }

      const filesArray = Array.from(files);

      // Validate all files
      let validationError: string | null = null;
      const validFiles: File[] = [];

      for (const file of filesArray) {
        if (!file.type.startsWith('image/')) {
          validationError = t('errorImageOnly');
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          validationError = t('errorTooLarge', { fileName: file.name });
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        setUploadError(validationError);
        return;
      }

      setUploadError(null);
      setUploading(true);

      const newImages: PetAdImageDto[] = [];

      // Upload files sequentially
      for (const file of validFiles) {
        try {
          setUploadProgress((prev) => ({ ...prev, [file.name]: true }));

          const result = await petAdService.uploadPetAdImage(file, token, locale);
          newImages.push(result);
        } catch (error) {
          console.error('Upload error:', error);
          setUploadError(t('uploadError', { fileName: file.name }));
        } finally {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }
      }

      // Update state with newly uploaded images
      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onChange({ imageIds: updatedImages.map((img) => img.id) });
        onImageUpdate?.(updatedImages);
      }

      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [images, onChange, onImageUpdate, token, locale, t]
  );

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  // Remove photo
  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];

    try {
      const result = await deletePetAdImageAction(imageToRemove.id);

      if (result.success) {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onChange({ imageIds: updatedImages.map((img) => img.id) });
        onImageUpdate?.(updatedImages);
        setUploadError(null);
      } else {
        setUploadError(result.error || t('deleteError'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      setUploadError(t('deleteError'));
    }
  };

  // Move photo (for reordering)
  const movePhoto = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [removed] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, removed);
    setImages(updatedImages);
    onChange({ imageIds: updatedImages.map((img) => img.id) });
    onImageUpdate?.(updatedImages);
  };

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

      {/* Error Message */}
      {uploadError && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-red-700 text-sm font-medium">{uploadError}</p>
        </div>
      )}

      {/* Photo Count */}
      <div className="flex items-center justify-between">
        <Label variant="field">
          {t('photoCount', { current: images.length, max: MAX_PHOTOS })}
          {uploading && <span className="ml-2 text-gray-500">({t('uploading')})</span>}
        </Label>
        {images.length >= MIN_PHOTOS && <span className="text-sm text-green-600 font-medium">✓ {t('minimumMet')}</span>}
      </div>

      {/* Photo Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100 border-2 border-gray-200">
              <img src={image.url} alt={t('imageAlt', { number: index + 1 })} className="absolute inset-0 w-full h-full object-cover" />

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg z-10 flex items-center gap-1.5">
                  <IconStar size={14} fill="currentColor" />
                  <span>{t('primary')}</span>
                </div>
              )}

              {/* Controls Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => movePhoto(index, index - 1)}
                    className="w-10 h-10 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-gray-100"
                    title={t('moveLeft')}
                  >
                    <IconChevronLeft size={20} className="text-gray-900" />
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="w-10 h-10 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50"
                  title={t('removePhoto')}
                >
                  <IconTrash size={20} className="text-red-600" />
                </button>

                {/* Move Right */}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => movePhoto(index, index + 1)}
                    className="w-10 h-10 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-gray-100"
                    title={t('moveRight')}
                  >
                    <IconChevronRight size={20} className="text-gray-900" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < MAX_PHOTOS && !uploading && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200',
            'flex flex-col items-center justify-center cursor-pointer',
            'hover:border-gray-400 hover:bg-gray-50',
            dragActive ? 'border-black bg-gray-50' : 'border-gray-300 bg-white',
            errors.imageIds && 'border-red-300 bg-red-50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />

          {/* Camera Icon */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <IconCamera size={32} className="text-gray-600" />
          </div>

          <Heading variant="card" className="mb-2">
            {images.length === 0 ? t('addPhotos') : t('addMorePhotos')}
          </Heading>
          <Text className="text-center mb-2">{t('dropzoneText')}</Text>
          <Text variant="small" color="muted">
            {t('remainingPhotos', { count: MAX_PHOTOS - images.length })}
          </Text>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="flex items-center justify-center gap-3 p-4 bg-info-50 border-2 border-info-200 rounded-xl">
          <svg className="animate-spin h-5 w-5 text-info-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm text-info-700 font-medium">{t('uploadingPhotos', { count: Object.keys(uploadProgress).length })}</p>
        </div>
      )}

      {errors.imageIds && (
        <Text variant="small" className="text-red-600">
          {errors.imageIds}
        </Text>
      )}

      {/* Helper Text */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-3 border-2 border-gray-200">
        <Heading variant="label">{t('photoTips')}</Heading>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>{t('tip1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>{t('tip2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>{t('tip3')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>{t('tip4')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>{t('tip5')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PhotosSection;
