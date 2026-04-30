import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://puppy.az';
const LOCALES = ['az', 'en', 'ru'];

const staticRoutes = [
  '',
  '/about',
  '/contact',
  '/blog',
  '/guides',
  '/help',
  '/safety',
  '/terms',
  '/privacy',
  '/careers',
  '/community',
  '/events',
  '/partnership',
  '/press',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.7,
      });
    }
  }

  return entries;
}
