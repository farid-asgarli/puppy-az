import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

/**
 * Centralized metadata configuration for the application
 */
export const SITE_CONFIG = {
  name: 'puppy.az',
  title: 'puppy.az',
  description: 'Azərbaycanda ev heyvanları alqı-satqısı üçün ən böyük platforma',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://puppy.az',
  ogImage: '/og-image.jpg',
} as const;

/**
 * Creates page metadata with consistent site branding
 * @param title - Page title (will be appended to site name)
 * @param description - Page description for SEO
 * @param options - Additional metadata options
 */
export function createMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: image ? [image] : [SITE_CONFIG.ogImage],
      siteName: SITE_CONFIG.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: image ? [image] : [SITE_CONFIG.ogImage],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * Creates simple metadata without Open Graph tags (for internal pages)
 */
export function createSimpleMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    description,
  };
}

/**
 * Creates localized metadata from translation keys
 * @param translationKey - The key path in the translations (e.g., 'metadata.register')
 * @param options - Additional metadata options
 */
export async function createLocalizedMetadata(translationKey: string, options?: { noIndex?: boolean; image?: string }): Promise<Metadata> {
  const t = await getTranslations(translationKey);

  const title = t('title');
  const description = t('description');
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: options?.image ? [options.image] : [SITE_CONFIG.ogImage],
      siteName: SITE_CONFIG.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: options?.image ? [options.image] : [SITE_CONFIG.ogImage],
    },
    ...(options?.noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * Creates simple localized metadata without Open Graph tags
 * @param translationKey - The key path in the translations (e.g., 'metadata.register')
 */
export async function createSimpleLocalizedMetadata(translationKey: string): Promise<Metadata> {
  const t = await getTranslations(translationKey);

  return {
    title: `${t('title')} | ${SITE_CONFIG.name}`,
    description: t('description'),
  };
}
