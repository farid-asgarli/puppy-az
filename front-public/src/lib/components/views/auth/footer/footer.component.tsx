'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import TransitionLink from '@/lib/components/transition-link';
import { Text } from '@/lib/primitives/typography';
import type { AuthFooterProps } from './footer.types';

/**
 * Auth Footer Component
 * Displays navigation links and terms/privacy at the bottom of auth pages
 * Includes link to toggle between login and register
 */
export const AuthFooter: React.FC<AuthFooterProps> = ({ message, linkText, linkHref, className }) => {
  const tNav = useTranslations('navigation');

  return (
    <div className={cn('space-y-6 pt-4 border-t border-gray-200', className)}>
      {/* Auth Toggle Link */}
      <div className="text-center">
        <Text variant="small" color="secondary">
          {message}{' '}
          <TransitionLink href={linkHref} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
            {linkText}
          </TransitionLink>
        </Text>
      </div>

      {/* Terms & Privacy */}
      <Text variant="tiny" color="tertiary" className="flex items-center justify-center gap-4">
        <TransitionLink href="/terms" className="hover:text-gray-900 transition-colors">
          {tNav('terms')}
        </TransitionLink>
        <span aria-hidden="true">•</span>
        <TransitionLink href="/privacy" className="hover:text-gray-900 transition-colors">
          {tNav('privacy')}
        </TransitionLink>
      </Text>
    </div>
  );
};

export default AuthFooter;
