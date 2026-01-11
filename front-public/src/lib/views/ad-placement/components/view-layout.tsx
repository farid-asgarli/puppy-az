'use client';

import { ReactNode } from 'react';

interface ViewLayoutProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Shared main content layout for ad placement views
 */
export function ViewLayout({ children, maxWidth = 'md' }: ViewLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return <main className={`flex-1 ${maxWidthClasses[maxWidth]} mx-auto px-6 py-12 w-full`}>{children}</main>;
}
