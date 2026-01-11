'use client';

import { NotFoundHeroSection } from './sections/hero.section';
import { NavigationHelpSection } from './sections/navigation-help.section';
import { PopularLinksSection } from './sections/popular-links.section';
import { SearchBarSection } from './sections/search-bar.section';

/**
 * NotFound View Component
 *
 * Global 404 error page with playful, cute design following puppy.az branding.
 * Provides multiple ways for users to find what they're looking for:
 * - Hero with Lottie animation and friendly messaging
 * - Quick navigation buttons to main sections
 * - Popular links to frequently accessed pages
 * - Search bar with quick suggestions
 *
 * Design principles:
 * - Airbnb-inspired generous whitespace
 * - Playful tone with Azerbaijani localization
 * - Multiple recovery paths to reduce bounce rate
 * - Responsive across all device sizes
 *
 * @example
 * ```tsx
 * // In app/not-found.tsx
 * import NotFoundView from '@/lib/views/not-found';
 *
 * export default function NotFound() {
 *   return <NotFoundView />;
 * }
 * ```
 */
export default function NotFoundView() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Main 404 display with animation */}
      <NotFoundHeroSection />

      {/* Navigation Help - Primary action buttons */}
      <NavigationHelpSection />

      {/* Popular Links - Quick access to main pages */}
      <PopularLinksSection />

      {/* Search Bar - Help users find what they need */}
      <SearchBarSection />
    </div>
  );
}
