"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/external/utils";

export interface ImageWithFallbackProps extends Omit<
  NextImageProps,
  "src" | "onError"
> {
  src: string | null | undefined;
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  showLoadingSkeleton?: boolean;
  alt: string;
}

/**
 * ImageWithFallback - Next.js Image component with automatic fallback support
 *
 * Features:
 * - Displays fallback when image fails to load (404, broken URL, etc.)
 * - Supports custom fallback image or custom fallback component
 * - Optional loading state with skeleton or custom component
 * - Maintains all Next.js Image optimization benefits
 * - Handles null/undefined src gracefully
 *
 * @example
 * ```tsx
 * // With fallback image
 * <ImageWithFallback
 *   src={pet.imageUrl}
 *   alt="Pet photo"
 *   fallbackSrc="/images/placeholder-pet.png"
 *   fill
 * />
 *
 * // With loading skeleton
 * <ImageWithFallback
 *   src={pet.imageUrl}
 *   alt="Pet photo"
 *   showLoadingSkeleton
 *   fill
 * />
 *
 * // With custom loading component
 * <ImageWithFallback
 *   src={pet.imageUrl}
 *   alt="Pet photo"
 *   loadingComponent={<Spinner />}
 *   width={300}
 *   height={200}
 * />
 *
 * // With custom fallback component
 * <ImageWithFallback
 *   src={pet.imageUrl}
 *   alt="Pet photo"
 *   fallbackComponent={<div>No image available</div>}
 *   width={300}
 *   height={200}
 * />
 * ```
 */
export function ImageWithFallback({
  src,
  fallbackSrc = "/images/placeholder.webp",
  fallbackComponent,
  loadingComponent,
  showLoadingSkeleton = false,
  alt,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  // If src is null/undefined or error occurred, show fallback
  const shouldShowFallback = !src || hasError;

  // Check if image is external (starts with http/https)
  const isExternalImage =
    src?.startsWith("http://") || src?.startsWith("https://");

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image load error:", src, e);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Custom fallback component takes priority
  if (shouldShowFallback && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Show fallback image
  if (shouldShowFallback) {
    return (
      <NextImage
        {...props}
        src={fallbackSrc}
        alt={alt}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <>
      {/* Loading state - only show if image hasn't loaded yet */}
      {isLoading && (showLoadingSkeleton || loadingComponent) && (
        <div className="absolute inset-0">
          {loadingComponent || (
            <div className="h-full w-full animate-pulse bg-gradient-to-br from-gray-200 to-gray-100" />
          )}
        </div>
      )}

      {/* Actual image */}
      <NextImage
        {...props}
        src={src}
        alt={alt}
        unoptimized={isExternalImage}
        className={cn(
          "object-cover",
          isLoading && "opacity-0",
          !isLoading && "opacity-100 transition-opacity duration-300",
          className,
        )}
        onError={handleError}
        onLoad={handleLoadingComplete}
      />
    </>
  );
}
