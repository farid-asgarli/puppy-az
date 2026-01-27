import { redirect } from '@/i18n';
import { getLocale } from 'next-intl/server';

interface PageProps {
  searchParams: Promise<{ new?: string; edit?: string }>;
}

/**
 * Root ad-placement page redirects appropriately:
 * - ?edit=ID -> directly to ad-type step (skip intro)
 * - ?new=true -> intro with new param
 * - default -> intro page
 */
export default async function AdPlacementPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const isNew = params.new === 'true';
  const editId = params.edit;

  if (editId) {
    // Edit mode - skip intro, go directly to first step
    redirect({ href: `/ads/ad-placement/ad-type?edit=${editId}`, locale });
  }

  redirect({ href: isNew ? '/ads/ad-placement/intro?new=true' : '/ads/ad-placement/intro', locale });
}
