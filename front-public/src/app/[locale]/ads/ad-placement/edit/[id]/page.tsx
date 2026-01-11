import { notFound } from 'next/navigation';
import { petAdService } from '@/lib/api/services/pet-ad.service';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';
import { getAccessToken } from '@/lib/auth/cookies';
import { EditAdView } from '@/lib/views/ad-edit';
import { getLocale } from 'next-intl/server';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.adPlacement.edit');
}

interface EditAdPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAdPage({ params }: EditAdPageProps) {
  const { id } = await params;
  const adId = parseInt(id, 10);
  const locale = await getLocale();

  // Validate ID
  if (isNaN(adId) || adId <= 0) {
    notFound();
  }

  // Get auth token
  const token = await getAccessToken();
  if (!token) {
    notFound();
  }

  try {
    // Fetch ad details from backend
    const adDetails = await petAdService.getPetAdDetails(adId, locale);

    // Note: Authorization is implicitly checked by the API
    // If user doesn't own this ad, API will return 403/404

    return <EditAdView adDetails={adDetails} />;
  } catch (error) {
    console.error('Failed to load ad for editing:', error);
    notFound();
  }
}
