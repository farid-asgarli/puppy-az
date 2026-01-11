'use client';

import { cn } from '@/lib/external/utils';
import TransitionLink from '@/lib/components/transition-link';
import { Heading, Text } from '@/lib/primitives/typography';
import { useTranslations } from 'next-intl';
import { LogoProps } from '@/lib/components/logo/logo.types';

/**
 * Auth Logo Component
 * Displays the puppy.az branding with gradient icon
 * Used in login and registration headers
 */
export const AppLogo: React.FC<LogoProps> = ({ href = '/', className, showTagline = true, showTitle = true }) => {
  const t = useTranslations('auth');

  return (
    <TransitionLink href={href} className={cn('inline-block relative z-50', className)} aria-label={t('tagline')}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" aria-hidden="true">
          <img src="/logo-black.png" alt="App Logo" className="h-8 w-auto" />
        </div>
        <div>
          <div className="hidden lg:block">
            {showTitle && (
              <Heading variant="subsection" className="text-gray-900">
                puppy.az
              </Heading>
            )}
            {showTagline && (
              <Text variant="tiny" color="tertiary">
                {t('tagline')}
              </Text>
            )}
          </div>
        </div>
      </div>
    </TransitionLink>
  );
};

export default AppLogo;
