'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAdPlacement } from '@/lib/contexts/ad-placement-context';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { useAuth } from '@/lib/hooks/use-auth';
import { getMinPhotoCount, type UploadedImageInfo } from '@/lib/types/ad-placement.types';
import { deletePetAdImageAction } from '@/lib/auth/actions';
import { petAdService } from '@/lib/api/services/pet-ad.service';
import { cn } from '@/lib/external/utils';
import { ViewFooter, ViewLayout } from '@/lib/views/ad-placement/components';
import { Heading, Text } from '@/lib/primitives/typography';
import { useLocale } from '@/lib/hooks/use-client-locale';

/**
 * Photos Upload View
 * Step 6: Upload pet photos with immediate backend upload
 */
export default function PhotosView() {
  const t = useTranslations('adPlacementDetails.photosView');
  const locale = useLocale();
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedImages, setUploadedImages] = useState<UploadedImageInfo[]>(formData.uploadedImages || []);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: boolean }>({});

  const minPhotos = getMinPhotoCount(formData.adType);
  const maxPhotos = 10;

  // Handle file selection and immediate upload
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      // Check if adding these files would exceed max
      if (uploadedImages.length + files.length > maxPhotos) {
        setUploadError(t('errorMaxPhotos', { maxPhotos }));
        return;
      }

      // CRITICAL: Convert FileList to Array immediately to prevent invalidation
      // FileList objects can become stale if the input element is cleared or modified
      // Array.from() creates a proper array with strong references to the File objects
      const filesArray = Array.from(files);

      // Validate all files before starting any uploads (without state updates)
      let validationError: string | null = null;
      const validFiles: File[] = [];

      for (const file of filesArray) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          validationError = t('errorImageOnly');
          continue;
        }

        // Validate file size (max 3MB as per backend)
        if (file.size > 3 * 1024 * 1024) {
          validationError = t('errorTooLarge', { fileName: file.name });
          continue;
        }

        validFiles.push(file);
      }

      // Early return if no valid files
      if (validFiles.length === 0) {
        setUploadError(validationError);
        return;
      }

      // Clear any previous errors and start uploading
      setUploadError(null);
      setUploading(true);

      // Get auth token for direct API calls (via useAuth hook)
      const token = await getToken();
      if (!token) {
        setUploadError('Authentication required. Please log in again.');
        setUploading(false);
        return;
      }

      console.log(`Starting upload of ${validFiles.length} files...`);

      const newUploadedImages: UploadedImageInfo[] = [];

      // Upload files sequentially using direct API calls
      // No need for ArrayBuffer conversion - direct API calls handle File objects perfectly
      for (const file of validFiles) {
        try {
          // Mark this file as uploading
          setUploadProgress((prev) => ({ ...prev, [file.name]: true }));

          console.log(`Uploading ${file.name} (${file.size} bytes, ${file.type})`);

          // Upload directly to API with locale - native fetch handles File objects perfectly
          const result = await petAdService.uploadPetAdImage(file, token, locale);
          console.log(`Upload result for ${file.name}:`, result);

          // Add to uploaded images
          newUploadedImages.push({
            id: result.id,
            url: result.url,
          });
        } catch (error) {
          console.error('Upload error:', error);
          setUploadError(`Failed to upload ${file.name}`);
        } finally {
          // Remove from uploading progress
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }
      }

      // Update state with all successfully uploaded images
      if (newUploadedImages.length > 0) {
        const updatedImages = [...uploadedImages, ...newUploadedImages];
        setUploadedImages(updatedImages);
        updateFormData({ uploadedImages: updatedImages });
      }

      setUploading(false);

      // CRITICAL: Only clear the file input AFTER all uploads are complete
      // This prevents the FileList from being invalidated mid-upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadedImages, maxPhotos, updateFormData, getToken, locale, t]
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

  // Handle file input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Get files and pass to handler - don't clear input here
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Note: input clearing happens in handleFiles after upload completes
    },
    [handleFiles]
  );

  // Remove photo (delete from backend and local state)
  const handleRemove = async (index: number) => {
    const imageToRemove = uploadedImages[index];

    try {
      // Delete from backend
      const result = await deletePetAdImageAction(imageToRemove.id);

      if (result.success) {
        // Remove from local state
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);
        updateFormData({ uploadedImages: updatedImages });
        setUploadError(null);
      } else {
        setUploadError(result.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setUploadError('Failed to delete image');
    }
  };

  // Move photo (for reordering)
  const movePhoto = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...uploadedImages];
    const [removed] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, removed);
    setUploadedImages(updatedImages);
    updateFormData({ uploadedImages: updatedImages });
  };

  const handleNext = () => {
    if (canProceed) {
      navigateWithTransition('/ads/ad-placement/details');
    }
  };

  const handleBack = () => {
    navigateWithTransition('/ads/ad-placement/location');
  };

  const canProceed = uploadedImages.length >= minPhotos && !uploading;

  return (
    <>
      <ViewLayout>
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <Heading variant="page-title">{t('heading')}</Heading>
            <Text variant="body-lg" color="secondary">
              {t('subheading', { minPhotos, plural: minPhotos !== 1 ? 's' : '' })}
            </Text>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{uploadError}</p>
            </div>
          )}

          {/* Photo Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {t('photoCount', { current: uploadedImages.length, max: maxPhotos })}
              {uploading && <span className="ml-2 text-gray-500">({t('uploading')})</span>}
            </p>
            {uploadedImages.length >= minPhotos && <span className="text-sm text-green-600 font-medium">✓ {t('minimumMet')}</span>}
          </div>

          {/* Photo Grid */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100">
                  <img src={image.url} alt={t('imageAlt', { number: index + 1 })} className="absolute inset-0 w-full h-full object-cover" />

                  {/* Primary Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs font-semibold rounded-lg z-10">{t('primary')}</div>
                  )}

                  {/* Controls Overlay */}
                  {/* Controls Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 pointer-events-none">
                    <div className="pointer-events-auto flex gap-2">
                      {/* Move Left */}
                      {index > 0 && (
                        <button
                          onClick={() => movePhoto(index, index - 1)}
                          className="w-10 h-10 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-gray-100"
                          title={t('moveLeft')}
                        >
                          <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleRemove(index)}
                        className="w-10 h-10 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50"
                        title={t('removePhoto')}
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>

                      {/* Move Right */}
                      {index < uploadedImages.length - 1 && (
                        <button
                          onClick={() => movePhoto(index, index + 1)}
                          className="w-10 h-10 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-gray-100"
                          title={t('moveRight')}
                        >
                          <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          {uploadedImages.length < maxPhotos && !uploading && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                'relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200',
                'flex flex-col items-center justify-center cursor-pointer',
                'hover:border-gray-400 hover:bg-gray-50',
                dragActive ? 'border-black bg-gray-50' : 'border-gray-300 bg-white'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />

              {/* Camera Icon */}
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <Heading variant="card" className="mb-2">
                {uploadedImages.length === 0 ? t('addPhotos') : t('addMorePhotos')}
              </Heading>
              <Text className="text-center mb-4">{t('dragDropText')}</Text>
              <Text variant="small" color="muted">
                {t('uploadRemaining', { count: maxPhotos - uploadedImages.length, plural: maxPhotos - uploadedImages.length === 1 ? '' : 's' })}
              </Text>
            </div>
          )}

          {/* Upload Progress Indicator */}
          {uploading && Object.keys(uploadProgress).length > 0 && (
            <div className="flex items-center justify-center gap-3 p-4 bg-info-50 border border-info-200 rounded-xl">
              <svg className="animate-spin h-5 w-5 text-info-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-sm text-info-700 font-medium">{t('uploadingProgress', { count: Object.keys(uploadProgress).length })}</p>
            </div>
          )}

          {/* Helper Text */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <Heading variant="label">{t('tipsHeading')}</Heading>
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
      </ViewLayout>
      <ViewFooter onBack={handleBack} onNext={handleNext} canProceed={canProceed} />
    </>
  );
}
