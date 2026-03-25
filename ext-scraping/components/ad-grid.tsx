'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Ad, PageInfo } from '@/lib/tapaz';
import { AdCard } from '@/components/ad-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface AdGridProps {
  initialAds: Ad[];
  initialPageInfo: PageInfo;
}

function AdCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-4 w-1/4 mt-1" />
      </div>
    </div>
  );
}

export function AdGrid({ initialAds, initialPageInfo }: AdGridProps) {
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !pageInfo.hasNextPage) return;
    loadingRef.current = true;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/ads?first=24&after=${encodeURIComponent(pageInfo.endCursor)}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data: { nodes: Ad[]; pageInfo: PageInfo } = await res.json();
      setAds((prev) => [...prev, ...data.nodes]);
      setPageInfo(data.pageInfo);
    } catch {
      setError(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [pageInfo]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '500px' },
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <section aria-label="Ad listings">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
        {loading && Array.from({ length: 12 }).map((_, i) => <AdCardSkeleton key={`sk-${i}`} />)}
      </div>

      {/* Sentinel for IntersectionObserver */}
      <div ref={sentinelRef} className="h-1" aria-hidden />

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm text-foreground font-medium">Yükləmə xətası baş verdi</p>
          <button
            onClick={loadMore}
            className="px-6 py-2.5 text-sm font-semibold text-foreground border border-foreground rounded-lg hover:bg-muted transition-colors"
          >
            Yenidən cəhd et
          </button>
        </div>
      )}

      {/* End of list */}
      {!pageInfo.hasNextPage && !loading && ads.length > 0 && (
        <div className="mt-16 mb-4 flex flex-col items-center gap-3">
          <div className="w-16 h-px bg-border" />
          <p className="text-sm text-muted-foreground">{ads.length} elan göstərildi</p>
        </div>
      )}
    </section>
  );
}
