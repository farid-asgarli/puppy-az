'use client';

import AppLogo from '@/lib/components/logo/logo';
import NavbarUserMenu from './user-menu';
import LanguageSelector from './language-selector';
import { NavbarConstants } from '@/lib/components/navbar/constants';
import { cn } from '@/lib/external/utils';

export default function DesktopNavbar({
  children,
  shouldExpand = false,
  isSticky = true,
}: {
  children?: React.ReactNode;
  shouldExpand?: boolean;
  isSticky?: boolean;
}) {
  return (
    <nav
      className={cn('w-full bg-white border-b border-gray-200 top-0 left-0 right-0 z-50', isSticky ? 'fixed' : 'relative')}
      style={{
        height: shouldExpand ? `${NavbarConstants.NAVBAR_HEIGHT_EXPANDED}px` : `${NavbarConstants.NAVBAR_HEIGHT_COLLAPSED}px`,
        transition: `height ${NavbarConstants.TRANSITION_DURATION}ms ${NavbarConstants.TRANSITION_TIMING}`,
      }}
    >
      <div className="max-w-[1760px] mx-auto px-6 lg:px-20 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <AppLogo />

          {children}

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <NavbarUserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
