import NotFoundView from '@/lib/views/not-found';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Səhifə tapılmadı | puppy.az',
  description: 'Axtardığınız səhifə tapılmadı. puppy.az-da balalar və digər ev heyvanları üçün elanlar.',
};

/**
 * Global Not Found Page
 *
 * This page is automatically shown by Next.js when:
 * - A route doesn't exist
 * - notFound() is called from a page/layout
 * - A dynamic route returns no data
 *
 * Provides a friendly, helpful 404 experience with multiple recovery paths.
 */
export default function NotFound() {
  return <NotFoundView />;
}
