'use client';

import { DesktopFooter } from './desktop-footer';
import { MobileFooter } from './mobile-footer';

// Main footer content (comprehensive version)
export const Footer = () => {
  return (
    <>
      {/* Desktop Footer - Hidden on mobile via CSS */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>

      {/* Mobile Footer - Hidden on desktop via CSS */}
      <div className="block md:hidden">
        <MobileFooter />
      </div>
    </>
  );
};
