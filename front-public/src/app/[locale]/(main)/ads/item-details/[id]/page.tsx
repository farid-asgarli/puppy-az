import { notFound, getLocale, getTranslations } from "@/i18n";
import { Metadata } from "next";
import { petAdService } from "@/lib/api/services/pet-ad.service";
import PetAdDetailsView from "@/lib/views/pet-ad-details/pet-ad-details.view";
import { createMetadata } from "@/lib/utils/metadata";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const adId = parseInt(id, 10);
  const locale = await getLocale();
  const t = await getTranslations("petAdDetails.metadata");

  if (isNaN(adId)) {
    return createMetadata({
      title: t("notFound.title"),
      description: t("notFound.description"),
    });
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_access_token")?.value;
    const adDetails = await petAdService.getPetAdDetailsWithAuth(
      adId,
      token,
      locale,
    );
    const price = adDetails.price
      ? `${adDetails.price} ${t("currency")}`
      : t("priceNegotiable");
    const title =
      adDetails.title ||
      `${adDetails.breed?.title || t("pet")} ${t("listing")}`;

    return createMetadata({
      title,
      description: `${title} - ${price}. ${adDetails.description?.substring(0, 150) || t("detailedInfo")}`,
      image: adDetails.images?.[0]?.url,
    });
  } catch {
    return createMetadata({
      title: t("notFound.title"),
      description: t("notFound.description"),
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

  // Get auth token from cookies if user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_access_token")?.value;

  try {
    // Fetch ad details - pass token if available so user can see their own unpublished ads
    const adDetails = await petAdService.getPetAdDetailsWithAuth(
      adId,
      token,
      locale,
    );

    // Fetch related ads separately - may fail for pending/draft ads
    let relatedAds: Awaited<
      ReturnType<typeof petAdService.getRelatedPetAds>
    >["items"] = [];
    try {
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
      relatedAds = relatedAdsResult.items;
    } catch {
      // Related ads may fail for unpublished ads - that's ok
    }

    const petCategories = await petAdService.getPetCategoriesDetailed(locale);

    return (
      <PetAdDetailsView
        adDetails={adDetails}
        relatedAds={relatedAds}
        petCategories={petCategories}
      />
    );
  } catch {
    // Ad not found or unavailable - show 404 page
    notFound();
  }
}
