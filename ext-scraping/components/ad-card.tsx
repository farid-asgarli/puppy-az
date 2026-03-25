'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { Ad } from '@/lib/tapaz';
import { AdDetailDialog } from '@/components/ad-detail-dialog';

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'indi';
  if (diff < 3600) return `${Math.floor(diff / 60)} dəq əvvəl`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat əvvəl`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} gün əvvəl`;
  return date.toLocaleDateString('az-AZ');
}

interface AdCardProps {
  ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const imageUrl = ad.desktopPhoto?.url ?? ad.photo?.url;
  const priceLabel = ad.price != null ? `${ad.price.toLocaleString()} ₼` : 'Razılaşma ilə';

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="group block text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl opacity-20 select-none">🐾</span>
            </div>
          )}

          {/* Heart overlay */}
          <div className="absolute top-3 right-3">
            <Heart className="size-6 drop-shadow-md text-white/80 group-hover:scale-110 transition-transform duration-200" strokeWidth={2} />
          </div>
        </div>

        {/* Info */}
        <div className="mt-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-foreground leading-snug line-clamp-1">{ad.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{ad.region}</p>
          <p className="text-sm text-muted-foreground">{timeAgo(ad.updatedAt)}</p>
          <p className="text-[15px] font-semibold text-foreground mt-1.5">{priceLabel}</p>
        </div>
      </button>

      <AdDetailDialog legacyId={ad.legacyResourceId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
