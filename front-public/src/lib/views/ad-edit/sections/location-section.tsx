'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CityDto } from '@/lib/api/types/city.types';
import { getCitiesAction } from '@/lib/auth/actions';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import { SearchableSelect } from '@/lib/form/components/select/select';
import { IconMapPin } from '@tabler/icons-react';

interface LocationSectionProps {
  formData: {
    cityId: number;
  };
  onChange: (data: Partial<LocationSectionProps['formData']>) => void;
  errors?: {
    cityId?: string;
  };
}

/**
 * Location Section
 * City selector with search capability
 */
export const LocationSection = ({ formData, onChange, errors = {} }: LocationSectionProps) => {
  const [cities, setCities] = useState<CityDto[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const t = useTranslations('adEdit.location');

  // Fetch cities from API using Server Action
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const result = await getCitiesAction();
        if (result.success) {
          setCities(result.data);
        } else {
          console.error('Failed to fetch cities:', result.error);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Get selected city
  const selectedCity = cities.find((c) => c.id === formData.cityId);

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

      {/* City Selector */}
      <div className="space-y-3">
        <Label variant="field" htmlFor="city-select">
          {t('city')}
        </Label>

        <SearchableSelect
          options={cities.map((city) => ({
            value: city.id.toString(),
            label: city.name || t('unknownCity'),
          }))}
          value={formData.cityId.toString()}
          onChange={(value) => onChange({ cityId: parseInt(value) })}
          placeholder={t('cityPlaceholder')}
          searchPlaceholder={t('citySearch')}
          emptyMessage={t('cityNoResults')}
          loading={loadingCities}
          error={!!errors.cityId}
          searchable
          size="lg"
          leftIcon={<IconMapPin size={20} />}
        />

        {errors.cityId && (
          <Text variant="small" className="text-red-600">
            {errors.cityId}
          </Text>
        )}

        {/* Cities Count */}
        {cities.length > 0 && (
          <Text variant="small" color="secondary">
            {t('citiesAvailable', { count: cities.length })}
          </Text>
        )}
      </div>

      {/* Selected City Display */}
      {selectedCity && (
        <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
              <IconMapPin size={20} className="text-success-600" />
            </div>
            <div>
              <Text variant="small" color="secondary" className="mb-0.5">
                {t('selectedLocation')}
              </Text>
              <p className="font-semibold text-gray-900">{selectedCity.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSection;
