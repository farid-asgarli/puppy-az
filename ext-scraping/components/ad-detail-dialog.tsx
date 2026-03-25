'use client';

import { useState, useCallback, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdDetail } from '@/lib/tapaz';
import { MapPin, Calendar, ExternalLink, User, Heart, Phone } from 'lucide-react';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('az-AZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface AdDetailDialogProps {
  legacyId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdDetailDialog({ legacyId, open, onOpenChange }: AdDetailDialogProps) {
  const [detail, setDetail] = useState<AdDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);
  const [phones, setPhones] = useState<string[]>([]);
  const [phonesLoading, setPhonesLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/ads/${legacyId}`);
      if (!res.ok) throw new Error('Failed');
      const data: AdDetail = await res.json();
      setDetail(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [legacyId]);

  const fetchPhones = useCallback(async () => {
    setPhonesLoading(true);
    try {
      const res = await fetch(`/api/ads/${legacyId}/phones`);
      if (!res.ok) throw new Error('Failed');
      const data: { phones: string[] } = await res.json();
      setPhones(data.phones ?? []);
    } catch {
      setPhones([]);
    } finally {
      setPhonesLoading(false);
    }
  }, [legacyId]);

  useEffect(() => {
    if (open) {
      setDetail(null);
      setCurrent(1);
      setPhones([]);
      setPhonesLoading(false);
      fetchDetail();
      fetchPhones();
    }
  }, [open, fetchDetail, fetchPhones]);

  useEffect(() => {
    if (!carouselApi) return;
    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on('select', () => setCurrent(carouselApi.selectedScrollSnap() + 1));
  }, [carouselApi]);

  const priceLabel = detail?.price != null ? `${detail.price.toLocaleString()} ₼` : 'Razılaşma ilə';

  const allProperties = detail
    ? [{ name: 'Şəhər', value: detail.region }, ...detail.properties, { name: 'Yenilənib', value: formatDate(detail.updatedAt) }]
    : [];

  const photos = detail?.photos ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-240 w-[calc(100vw-2rem)] max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* sr-only accessibility header */}
        <DialogHeader className="sr-only">
          <DialogTitle>{detail?.title ?? 'Elan detalları'}</DialogTitle>
          <DialogDescription>{detail?.region ?? 'Yüklənir...'}</DialogDescription>
        </DialogHeader>

        {/* Close button — always visible top-right */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-50 size-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm border border-border/30 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* ── LEFT: Photo carousel ── */}
          <div className="md:w-[55%] shrink-0 bg-muted flex flex-col overflow-hidden">
            {loading ? (
              <Skeleton className="w-full rounded-none md:rounded-l-xl" style={{ height: 'min(60vh, 500px)' }} />
            ) : photos.length > 0 ? (
              <div className="relative flex-1 flex flex-col overflow-hidden" style={{ height: 'min(60vh, 500px)' }}>
                <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="h-full overflow-hidden">
                  <CarouselContent className="h-full ml-0">
                    {photos.map((photo, i) => (
                      <CarouselItem key={i} className="pl-0 relative overflow-hidden" style={{ height: 'min(60vh, 500px)' }}>
                        <Image
                          src={photo.url}
                          alt={detail?.title ?? ''}
                          fill
                          className="object-cover object-center md:rounded-l-xl"
                          sizes="(max-width: 768px) 100vw, 528px"
                          unoptimized
                          priority={i === 0}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Prev/next inset inside the image */}
                  <CarouselPrevious className="left-3 size-8 bg-white/90 hover:bg-white border-white/40 shadow-md" />
                  <CarouselNext className="right-3 size-8 bg-white/90 hover:bg-white border-white/40 shadow-md" />
                </Carousel>

                {/* Counter + heart */}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
                  <span className="bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-md pointer-events-none">
                    {current} / {count}
                  </span>
                  <button className="pointer-events-auto size-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-sm transition-colors">
                    <Heart className="size-4 text-foreground" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center" style={{ height: 'min(60vh, 500px)' }}>
                <span className="text-6xl opacity-20 select-none">🐾</span>
              </div>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="md:w-[45%] flex flex-col overflow-y-auto">
            <div className="px-6 pt-6 pb-8 flex flex-col gap-0 flex-1">
              {/* Loading skeleton */}
              {loading && (
                <div className="space-y-4 pt-2">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="h-px bg-border my-3" />
                  <div className="space-y-2.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-6">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-border my-3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <p className="text-sm font-medium">Yükləmə xətası baş verdi</p>
                  <button
                    onClick={fetchDetail}
                    className="mt-4 px-6 py-2.5 text-sm font-semibold border border-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Yenidən cəhd et
                  </button>
                </div>
              )}

              {/* Content */}
              {!loading && !error && detail && (
                <>
                  {/* Title + price + location */}
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-semibold leading-snug pr-8">{detail.title}</h2>
                    <p className="text-2xl font-bold">{priceLabel}</p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      {detail.region}
                      <span className="mx-0.5">·</span>
                      <Calendar className="size-3.5 shrink-0" />
                      {formatDate(detail.updatedAt)}
                    </p>
                  </div>

                  {/* Properties table */}
                  {allProperties.length > 0 && (
                    <>
                      <div className="h-px bg-border mt-5 mb-4" />
                      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
                        {allProperties.map((prop) => (
                          <Fragment key={prop.name}>
                            <dt className="text-muted-foreground whitespace-nowrap">{prop.name}</dt>
                            <dd className="font-medium">{prop.value}</dd>
                          </Fragment>
                        ))}
                      </dl>
                    </>
                  )}

                  {/* Description */}
                  {detail.body && (
                    <>
                      <div className="h-px bg-border mt-5 mb-4" />
                      <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">{detail.body}</p>
                    </>
                  )}

                  {/* Seller */}
                  {detail.user && (
                    <>
                      <div className="h-px bg-border mt-5 mb-4" />
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <User className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-tight">{detail.user.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Satıcı</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Phone number */}
                  <>
                    <div className="h-px bg-border mt-5 mb-4" />
                    {phonesLoading ? (
                      <div className="flex items-center justify-center gap-2 w-full border-2 border-border text-muted-foreground font-semibold text-[15px] py-3 rounded-xl opacity-60">
                        <Phone className="size-4" />
                        Yüklənir...
                      </div>
                    ) : phones.length > 0 ? (
                      <div className="space-y-2">
                        {phones.map((phone) => {
                          const digits = phone.replace(/[()\s-]/g, '');
                          // Normalize to international format for WhatsApp (assume AZ +994 if starts with 0)
                          const waNumber = digits.startsWith('0') ? `994${digits.slice(1)}` : digits;
                          const waText = encodeURIComponent(`Salam! tap.az elanı ilə bağlı: "${detail.title}" — https://tap.az${detail.path}`);
                          const waUrl = `https://web.whatsapp.com/send/?phone=${waNumber}&text=${waText}&type=phone_number&app_absent=0`;
                          return (
                            <div key={phone} className="flex gap-2">
                              <a
                                href={`tel:${digits}`}
                                className="flex flex-1 items-center justify-center gap-2 border-2 border-foreground text-foreground font-semibold text-[15px] py-3 rounded-xl hover:bg-muted transition-colors"
                              >
                                <Phone className="size-4" />
                                {phone}
                              </a>
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="flex items-center justify-center px-4 border-2 border-[#25D366] text-[#25D366] rounded-xl hover:bg-[#25D366]/10 transition-colors"
                              >
                                <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </>

                  {/* CTA */}
                  <div className="mt-auto pt-6">
                    <a
                      href={`https://tap.az${detail.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-semibold text-[15px] py-3.5 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                      tap.az-da bax
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
