'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PetAdDetailsDto, PetAdImageDto, UpdatePetAdCommand } from '@/lib/api/types/pet-ad.types';
import { updatePetAdAction, closeAdAction } from '@/lib/auth/actions';
import { useAuth } from '@/lib/hooks/use-auth';
import { PageHeader } from '@/lib/components/views/common';
import {
  AdOverviewSection,
  BasicInformationSection,
  PhysicalCharacteristicsSection,
  LocationSection,
  PhotosSection,
  DetailsSection,
  PricingSection,
  ActionsSection,
} from './sections';

interface EditAdViewProps {
  adDetails: PetAdDetailsDto;
}

export const EditAdView = ({ adDetails }: EditAdViewProps) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const t = useTranslations('adEdit');

  // Form state
  const [formData, setFormData] = useState({
    petBreedId: adDetails.breed.id,
    gender: adDetails.gender,
    ageInMonths: adDetails.ageInMonths,
    size: adDetails.size,
    color: adDetails.color,
    weight: adDetails.weight,
    cityId: adDetails.cityId,
    imageIds: adDetails.images.map((img) => img.id),
    title: adDetails.title,
    description: adDetails.description,
    price: adDetails.price || 0,
  });

  const [images, setImages] = useState<PetAdImageDto[]>(adDetails.images);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track changes
  useEffect(() => {
    const changed =
      formData.petBreedId !== adDetails.breed.id ||
      formData.gender !== adDetails.gender ||
      formData.ageInMonths !== adDetails.ageInMonths ||
      formData.size !== adDetails.size ||
      formData.color !== adDetails.color ||
      formData.weight !== adDetails.weight ||
      formData.cityId !== adDetails.cityId ||
      formData.title !== adDetails.title ||
      formData.description !== adDetails.description ||
      formData.price !== (adDetails.price || 0) ||
      JSON.stringify(formData.imageIds) !== JSON.stringify(adDetails.images.map((img) => img.id));

    setHasChanges(changed);
  }, [formData, adDetails]);

  // Handle form field changes
  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Breed
    if (!formData.petBreedId || formData.petBreedId <= 0) {
      newErrors.petBreedId = t('validation.breedRequired');
    }

    // Gender
    if (!formData.gender) {
      newErrors.gender = t('validation.genderRequired');
    }

    // Age
    if (!formData.ageInMonths || formData.ageInMonths <= 0) {
      newErrors.ageInMonths = t('validation.ageRequired');
    }

    // Size
    if (!formData.size) {
      newErrors.size = t('validation.sizeRequired');
    }

    // Color
    if (!formData.color || formData.color.trim().length === 0) {
      newErrors.color = t('validation.colorRequired');
    }

    // City
    if (!formData.cityId || formData.cityId <= 0) {
      newErrors.cityId = t('validation.cityRequired');
    }

    // Images
    if (!formData.imageIds || formData.imageIds.length === 0) {
      newErrors.imageIds = t('validation.imagesRequired');
    }

    // Title
    if (!formData.title || formData.title.trim().length < 10) {
      newErrors.title = t('validation.titleMinLength');
    } else if (formData.title.trim().length > 100) {
      newErrors.title = t('validation.titleMaxLength');
    }

    // Description
    if (!formData.description || formData.description.trim().length < 30) {
      newErrors.description = t('validation.descriptionMinLength');
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = t('validation.descriptionMaxLength');
    }

    // Price (only for Sale ads)
    if (adDetails.adType === 1 && formData.price <= 0) {
      newErrors.price = t('validation.pricePositive');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes
  const handleSave = async () => {
    if (!validate()) {
      setSaveError(t('validation.fillAllRequired'));
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const token = await getToken();
      if (!token) {
        setSaveError(t('validation.authRequired'));
        setIsSaving(false);
        return;
      }

      const updateData: UpdatePetAdCommand = {
        id: adDetails.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        ageInMonths: formData.ageInMonths,
        gender: formData.gender,
        adType: adDetails.adType,
        color: formData.color.trim(),
        weight: formData.weight,
        size: formData.size,
        price: formData.price,
        cityId: formData.cityId,
        petBreedId: formData.petBreedId,
        imageIds: formData.imageIds,
      };

      const result = await updatePetAdAction(updateData);

      if (result.success) {
        // Redirect to ad details page
        router.push(`/ads/item-details/${adDetails.id}`);
      } else {
        setSaveError(result.error || t('validation.saveError'));
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveError(t('validation.generalError'));
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(t('confirmations.unsavedChanges'));
      if (!confirmed) return;
    }
    router.back();
  };

  // Preview ad
  const handlePreview = () => {
    router.push(`/ads/item-details/${adDetails.id}`);
  };

  // Delete ad
  const handleDelete = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await closeAdAction(adDetails.id);

      if (result.success) {
        router.push('/my-account/ads/active');
      } else {
        setSaveError(result.error || t('validation.deleteError'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      setSaveError(t('validation.generalError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader title={t('pageTitle')} subtitle={t('overview.subheading')} maxWidth="xl" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-20">
          {/* Section 1: Ad Overview */}
          <AdOverviewSection ad={adDetails} />

          {/* Section 2: Basic Information */}
          <BasicInformationSection
            ad={adDetails}
            formData={{
              petBreedId: formData.petBreedId,
              gender: formData.gender,
              ageInMonths: formData.ageInMonths,
              size: formData.size,
            }}
            onChange={(data) => {
              Object.entries(data).forEach(([key, value]) => {
                handleChange(key, value);
              });
            }}
            errors={errors}
          />

          {/* Section 3: Physical Characteristics */}
          <PhysicalCharacteristicsSection
            formData={{
              color: formData.color,
              weight: formData.weight,
            }}
            onChange={(data) => {
              Object.entries(data).forEach(([key, value]) => {
                handleChange(key, value);
              });
            }}
            errors={errors}
          />

          {/* Section 4: Location */}
          <LocationSection
            formData={{
              cityId: formData.cityId,
            }}
            onChange={(data) => {
              handleChange('cityId', data.cityId);
            }}
            errors={errors}
          />

          {/* Section 5: Photos */}
          <PhotosSection
            existingImages={images}
            onChange={(data) => {
              handleChange('imageIds', data.imageIds);
            }}
            onImageUpdate={(updatedImages) => {
              setImages(updatedImages);
              handleChange(
                'imageIds',
                updatedImages.map((img) => img.id)
              );
            }}
            errors={errors}
            token={''} // Token will be fetched inside the component
          />

          {/* Section 6: Details */}
          <DetailsSection
            formData={{
              title: formData.title,
              description: formData.description,
            }}
            onChange={(data) => {
              Object.entries(data).forEach(([key, value]) => {
                handleChange(key, value);
              });
            }}
            errors={errors}
          />

          {/* Section 7: Pricing (conditional) */}
          <PricingSection
            adType={adDetails.adType}
            formData={{
              price: formData.price,
            }}
            onChange={(data) => {
              handleChange('price', data.price);
            }}
            errors={errors}
          />

          {/* Section 8: Actions */}
          <ActionsSection
            hasChanges={hasChanges}
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={handleCancel}
            onPreview={handlePreview}
            onDelete={handleDelete}
            saveError={saveError}
          />
        </div>
      </div>
    </div>
  );
};

export default EditAdView;
