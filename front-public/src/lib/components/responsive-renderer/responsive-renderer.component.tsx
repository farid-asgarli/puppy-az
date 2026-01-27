'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useServerInsertedHTML } from '@/i18n';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { responsiveStyles } from './responsive-renderer.constants';

/**
 * @typedef {Object} ResponsiveRendererProps
 * @property {number} breakpoint - Breakpoint in pixels
 * @property {() => ReactNode} renderMobile - Function to render mobile view
 * @property {() => ReactNode} renderDesktop - Function to render desktop view
 * @property {ReactNode} [loadingFallback] - Optional fallback during loading
 * @property {string} [className] - Optional additional class names
 * @property {boolean} [noSSR] - Option to disable SSR rendering completely
 * @property {boolean} [deferMobileRender] - Option to defer rendering mobile component until needed
 * @property {boolean} [deferDesktopRender] - Option to defer rendering desktop component until needed
 */
type ResponsiveRendererProps = {
  breakpoint: number;
  renderMobile: () => ReactNode;
  renderDesktop: () => ReactNode;
  loadingFallback?: ReactNode;
  className?: string;
  noSSR?: boolean;
  deferMobileRender?: boolean;
  deferDesktopRender?: boolean;
  testId?: string;
};

/**
 * Component that renders different content based on screen size
 * Handles SSR, hydration mismatches, and provides optimization options
 */
export const ResponsiveRenderer: React.FC<ResponsiveRendererProps> = ({
  breakpoint,
  renderMobile,
  renderDesktop,
  loadingFallback = null,
  className = '',
  noSSR = false,
  deferMobileRender = false,
  deferDesktopRender = false,
  testId = 'responsive-renderer',
}) => {
  const isMobile = useMediaQuery(`(max-width: ${breakpoint}px)`);
  const [initialized, setInitialized] = useState(false);
  const [mobileRendered, setMobileRendered] = useState(!deferMobileRender);
  const [desktopRendered, setDesktopRendered] = useState(!deferDesktopRender);

  // Handle any CSS needed for SSR
  useServerInsertedHTML(() => {
    if (noSSR) return null;

    // This injects critical CSS needed for the responsive behavior
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .responsive-container { position: relative; width: 100%; }
          .responsive-hidden { position: absolute; visibility: hidden; overflow: hidden; width: 0; height: 0; }
          .responsive-visible { position: relative; visibility: visible; width: 100%; }
        `,
        }}
      />
    );
  });

  // Set initialized after initial render to handle potential hydration mismatch
  useEffect(() => {
    // Use requestAnimationFrame for better performance than setTimeout
    const handleInitialization = () => {
      setInitialized(true);

      // Trigger rendering of deferred components based on screen size
      if (deferMobileRender && isMobile) {
        setMobileRendered(true);
      }
      if (deferDesktopRender && !isMobile) {
        setDesktopRendered(true);
      }
    };

    // Use requestAnimationFrame to run after browser paint
    const frameId = requestAnimationFrame(handleInitialization);

    return () => cancelAnimationFrame(frameId);
  }, [isMobile, deferMobileRender, deferDesktopRender]);

  // Trigger rendering of components when media query changes
  useEffect(() => {
    if (!initialized) return;

    if (isMobile && deferMobileRender && !mobileRendered) {
      setMobileRendered(true);
    }
    if (!isMobile && deferDesktopRender && !desktopRendered) {
      setDesktopRendered(true);
    }
  }, [isMobile, initialized, deferMobileRender, deferDesktopRender, mobileRendered, desktopRendered]);

  // Option 1: No SSR, only render on client
  if (noSSR) {
    // If not mounted yet, show loading fallback
    if (!initialized || isMobile === undefined) {
      return loadingFallback ? (
        <div className={responsiveStyles.loadingContainer} data-testid={`${testId}-loading`} role='status' aria-live='polite'>
          {loadingFallback}
        </div>
      ) : null;
    }

    // Once mounted and media query determined, show the correct version
    return (
      <div data-testid={testId} className={className}>
        {isMobile ? (mobileRendered ? renderMobile() : null) : desktopRendered ? renderDesktop() : null}
      </div>
    );
  }

  // Option 2: Zero-flicker approach with CSS for SSR
  return (
    <div className={`${responsiveStyles.container} ${className}`} data-testid={testId}>
      {/* Desktop Version */}
      {desktopRendered && (
        <div
          className={
            !initialized || isMobile === undefined
              ? responsiveStyles.hiddenItem // Hide during SSR and hydration
              : isMobile === false
                ? responsiveStyles.visibleItem // Show if desktop confirmed
                : responsiveStyles.hiddenItem // Hide if mobile confirmed
          }
          aria-hidden={initialized && isMobile === true}
          data-testid={`${testId}-desktop`}
        >
          {renderDesktop()}
        </div>
      )}

      {/* Mobile Version */}
      {mobileRendered && (
        <div
          className={
            !initialized || isMobile === undefined
              ? responsiveStyles.hiddenItem // Hide during SSR and hydration
              : isMobile === true
                ? responsiveStyles.visibleItem // Show if mobile confirmed
                : responsiveStyles.hiddenItem // Hide if desktop confirmed
          }
          aria-hidden={initialized && isMobile === false}
          data-testid={`${testId}-mobile`}
        >
          {renderMobile()}
        </div>
      )}

      {/* Loading fallback shown during SSR and hydration */}
      {(!initialized || isMobile === undefined) && loadingFallback && (
        <div className={responsiveStyles.loadingContainer} data-testid={`${testId}-loading`} role='status' aria-live='polite'>
          {loadingFallback}
        </div>
      )}
    </div>
  );
};

// Higher order component for easier usage
export function withResponsive<P extends object>(
  DesktopComponent: React.ComponentType<P>,
  MobileComponent: React.ComponentType<P>,
  options: {
    breakpoint: number;
    loadingFallback?: ReactNode;
    className?: string;
    noSSR?: boolean;
    deferMobileRender?: boolean;
    deferDesktopRender?: boolean;
    testId?: string;
  },
): React.FC<P> {
  return (props) => (
    <ResponsiveRenderer
      breakpoint={options.breakpoint}
      renderDesktop={() => <DesktopComponent {...props} />}
      renderMobile={() => <MobileComponent {...props} />}
      loadingFallback={options.loadingFallback}
      className={options.className}
      noSSR={options.noSSR}
      deferMobileRender={options.deferMobileRender}
      deferDesktopRender={options.deferDesktopRender}
      testId={options.testId}
    />
  );
}
