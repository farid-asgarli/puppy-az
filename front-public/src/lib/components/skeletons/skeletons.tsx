"use client";

import { cn } from "@/lib/external/utils";

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gray-100",
        "before:absolute before:inset-0",
        "before:-translate-x-full before:animate-[shimmer_1.5s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-gray-200/60 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Navbar skeleton - matches the actual navbar structure
 */
export function NavbarSkeleton() {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Skeleton className="h-8 w-28 rounded-lg" />

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <Skeleton className="h-11 w-full rounded-full" />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full hidden md:block" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hero section skeleton - clean minimalist design
 */
export function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-[85vh] flex items-center">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-slate-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left space-y-6">
            {/* Title skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-12 sm:h-14 md:h-16 w-full max-w-md mx-auto lg:mx-0 rounded-2xl" />
              <Skeleton className="h-12 sm:h-14 md:h-16 w-4/5 max-w-sm mx-auto lg:mx-0 rounded-2xl" />
            </div>

            {/* Subtitle */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-5 sm:h-6 w-full max-w-lg mx-auto lg:mx-0 rounded-lg" />
              <Skeleton className="h-5 sm:h-6 w-3/4 max-w-md mx-auto lg:mx-0 rounded-lg" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3 sm:gap-4 pt-4">
              <Skeleton className="h-14 w-full sm:w-44 rounded-xl bg-gray-300" />
              <Skeleton className="h-14 w-full sm:w-44 rounded-xl" />
            </div>

            {/* Trust indicators */}
            <div className="pt-6">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image placeholder (desktop only) */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Stacked cards effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-56 h-72 rounded-3xl bg-white shadow-md transform -rotate-6 -translate-x-4" />
                <div className="absolute w-56 h-72 rounded-3xl bg-white shadow-lg transform rotate-3 translate-x-4" />
                <div className="absolute w-56 h-72 rounded-3xl bg-white shadow-xl">
                  <div className="h-40 bg-gray-100 rounded-t-3xl animate-pulse" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-5 w-20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Ad card skeleton - matches the AdCard structure
 */
export function AdCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Image */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 rounded" />

        {/* Category */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        {/* Location and age */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>

        {/* Price and date */}
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Clean Ad Card Skeleton
 */
export function ResponsiveAdCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[260px] sm:w-72 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-[4/3] w-full bg-gray-100 animate-pulse" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-4/5 rounded" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>

        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Cards carousel skeleton - compact section with cards
 */
export function CardsCarouselSkeleton({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {showHeader && (
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-6 sm:h-7 w-28 sm:w-36 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        )}

        {/* Carousel cards */}
        <div className="flex gap-4 overflow-hidden">
          <ResponsiveAdCardSkeleton />
          <ResponsiveAdCardSkeleton />
          <div className="hidden sm:block">
            <ResponsiveAdCardSkeleton />
          </div>
          <div className="hidden lg:block">
            <ResponsiveAdCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Category cards skeleton
 */
export function CategoryCardsSkeleton() {
  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-64 mx-auto rounded-lg mb-3" />
          <Skeleton className="h-5 w-96 mx-auto rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100"
            >
              <Skeleton className="h-16 w-16 mx-auto rounded-2xl mb-4" />
              <Skeleton className="h-5 w-20 mx-auto rounded mb-2" />
              <Skeleton className="h-4 w-16 mx-auto rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Full home page skeleton - clean, minimal design
 */
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <HeroSkeleton />

      {/* Content section with carousels */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="space-y-10 sm:space-y-14">
          <CardsCarouselSkeleton />
          <CardsCarouselSkeleton />
        </div>
      </section>
    </div>
  );
}

/**
 * Search results page skeleton - matches the ads search layout
 */
export function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Search header area */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          {/* Page title and count */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter chips */}
        <div className="flex gap-2 sm:gap-3 mb-6 overflow-hidden flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-9 sm:h-10 w-20 sm:w-28 rounded-full flex-shrink-0"
            />
          ))}
        </div>

        {/* Results grid - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-full">
              <ResponsiveAdCardSkeleton />
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Ad details page skeleton - premium design with smooth animations
 */
export function AdDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-gray-50">
      {/* Hero Image Section with Gradient Overlay */}
      <div className="relative">
        {/* Back button area */}
        <div className="absolute top-4 left-4 z-10">
          <div className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg animate-pulse" />
        </div>

        {/* Main Image Skeleton with gradient shimmer */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] max-h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />

          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg animate-pulse" />
          </div>

          {/* Image counter badge */}
          <div className="absolute bottom-4 right-4">
            <div className="h-8 w-16 rounded-full bg-black/30 backdrop-blur-md animate-pulse" />
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white shadow-lg overflow-hidden",
                "ring-2 ring-white",
                i === 0 && "ring-primary-200",
              )}
            >
              <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid lg:grid-cols-[1fr,380px] gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Title & Price Section */}
            <div className="space-y-4">
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full bg-gradient-to-r from-slate-100 to-slate-50" />
                <Skeleton className="h-7 w-16 rounded-full bg-gradient-to-r from-slate-100 to-slate-50" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-9 sm:h-10 w-full max-w-xl rounded-xl" />
                <Skeleton className="h-9 sm:h-10 w-3/5 rounded-xl" />
              </div>

              {/* Price with currency */}
              <div className="flex items-baseline gap-2 pt-2">
                <Skeleton className="h-12 w-40 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/50" />
              </div>

              {/* Meta info row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-slate-100 animate-pulse" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-slate-100 animate-pulse" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-slate-100 animate-pulse" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
              <Skeleton className="h-6 w-36 rounded-lg mb-5" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100/50"
                  >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse flex-shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-3 w-14 rounded" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
              <Skeleton className="h-6 w-28 rounded-lg mb-5" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-[95%] rounded-md" />
                <Skeleton className="h-4 w-[88%] rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            </div>

            {/* Q&A Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
              <div className="flex items-center justify-between mb-5">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-3 w-16 rounded ml-auto" />
                    </div>
                    <Skeleton className="h-4 w-full rounded ml-11" />
                    <Skeleton className="h-4 w-2/3 rounded ml-11" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
            {/* Seller Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-100 border-2 border-white animate-pulse" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 py-4 border-y border-gray-100 mb-5">
                <div className="flex-1 text-center space-y-1">
                  <Skeleton className="h-5 w-8 rounded mx-auto" />
                  <Skeleton className="h-3 w-12 rounded mx-auto" />
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="flex-1 text-center space-y-1">
                  <Skeleton className="h-5 w-10 rounded mx-auto" />
                  <Skeleton className="h-3 w-14 rounded mx-auto" />
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <div className="h-12 w-full rounded-2xl bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
                <div className="h-12 w-full rounded-2xl bg-gradient-to-r from-green-100 to-green-50 animate-pulse" />
                <div className="h-12 w-full rounded-2xl bg-slate-100 animate-pulse" />
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-5 border border-amber-100/50">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 animate-pulse flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-28 rounded bg-amber-100/70" />
                  <Skeleton className="h-3 w-full rounded bg-amber-100/50" />
                  <Skeleton className="h-3 w-4/5 rounded bg-amber-100/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generic page skeleton - for other pages
 */
export function GenericPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarSkeleton />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-10 w-64 rounded-lg mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-5/6 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * My Account page skeleton - dashboard with sidebar
 */
export function MyAccountSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSkeleton />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6">
              <Skeleton className="h-8 w-48 rounded-lg mb-6" />

              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <Skeleton className="h-8 w-16 rounded mb-2" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                ))}
              </div>

              {/* Content area */}
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4 rounded" />
                        <Skeleton className="h-4 w-1/2 rounded" />
                      </div>
                      <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
