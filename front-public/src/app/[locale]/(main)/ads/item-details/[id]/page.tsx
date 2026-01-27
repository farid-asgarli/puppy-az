import { notFound, getLocale, getTranslations } from '@/i18n';
import { Metadata } from 'next';
import { petAdService } from '@/lib/api/services/pet-ad.service';
import PetAdDetailsView from '@/lib/views/pet-ad-details/pet-ad-details.view';
import { createMetadata } from '@/lib/utils/metadata';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const adId = parseInt(id, 10);
  const locale = await getLocale();
  const t = await getTranslations('petAdDetails.metadata');

  if (isNaN(adId)) {
    return createMetadata({
      title: t('notFound.title'),
      description: t('notFound.description'),
    });
  }

  try {
    const adDetails = await petAdService.getPetAdDetails(adId, locale);
    const price = adDetails.price ? `${adDetails.price} ${t('currency')}` : t('priceNegotiable');
    const title = adDetails.title || `${adDetails.breed?.title || t('pet')} ${t('listing')}`;

    return createMetadata({
      title,
      description: `${title} - ${price}. ${adDetails.description?.substring(0, 150) || t('detailedInfo')}`,
      image: adDetails.images?.[0]?.url,
    });
  } catch {
    return createMetadata({
      title: t('notFound.title'),
      description: t('notFound.description'),
    });
  }
}

export default async function PetAdDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const adId = parseInt(id, 10);
  const locale = await getLocale();

  if (isNaN(adId)) {
    notFound();
  }

  try {
    // Fetch ad details
    const adDetails = await petAdService.getPetAdDetails(adId, locale);
    const relatedAdsResult = await petAdService.getRelatedPetAds(
      {
        petAdId: adId,
        specification: {
          pagination: {
            number: 1,
            size: 6,
          },
        },
      },
      locale,
    );

    const petCategories = await petAdService.getPetCategoriesDetailed(locale);

    return <PetAdDetailsView adDetails={adDetails} relatedAds={relatedAdsResult.items} petCategories={petCategories} />;
  } catch (error) {
    console.error('Failed to fetch pet ad details:', error);
    notFound();
  }
}
