'use client';

import { IconHome, IconPaw, IconSearch } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import TransitionLink from '@/lib/components/transition-link';

interface NavigationHelpSectionProps {
  className?: string;
}

export const NavigationHelpSection: React.FC<NavigationHelpSectionProps> = ({ className }) => {
  const t = useTranslations('notFound.navigationHelp');

  const navigationActions = [
    {
      href: '/',
      label: t('actions.home.label'),
      description: t('actions.home.description'),
      icon: IconHome,
      variant: 'primary' as const,
    },
    {
      href: '/ads',
      label: t('actions.browseAds.label'),
      description: t('actions.browseAds.description'),
      icon: IconPaw,
      variant: 'secondary' as const,
    },
    {
      href: '/ads?search=true',
      label: t('actions.search.label'),
      description: t('actions.search.description'),
      icon: IconSearch,
      variant: 'secondary' as const,
    },
  ];

  return (
    <section className={cn('py-12 lg:py-16 bg-gray-50', className)}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-12">
          <Heading variant="section" as="h2" className="mb-3">
            {t('title')}
          </Heading>
          <Text variant="body-lg" color="secondary">
            {t('subtitle')}
          </Text>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {navigationActions.map((action) => {
            const Icon = action.icon;
            return (
              <TransitionLink key={action.href} href={action.href} className="group">
                <div
                  className={cn(
                    'h-full p-6 rounded-2xl border-2 transition-all duration-200',
                    'hover:scale-[1.02] hover:shadow-lg',
                    action.variant === 'primary'
                      ? 'bg-black text-white border-black hover:bg-gray-800'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-black'
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      action.variant === 'primary' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-black/5'
                    )}
                  >
                    <Icon size={24} className={cn(action.variant === 'primary' ? 'text-white' : 'text-gray-700')} />
                  </div>

                  {/* Label */}
                  <Heading variant="card" as="h3" className={cn('mb-2', action.variant === 'primary' ? 'text-white' : 'text-gray-900')}>
                    {action.label}
                  </Heading>

                  {/* Description */}
                  <Text variant="small" className={cn(action.variant === 'primary' ? 'text-white/80' : 'text-gray-600')} as="p">
                    {action.description}
                  </Text>
                </div>
              </TransitionLink>
            );
          })}
        </div>

        {/* Additional Help Text */}
        <div className="mt-10 text-center">
          <Text variant="body" color="secondary">
            {t('helpText.beforeLink')}{' '}
            <TransitionLink href="/help" className="text-black font-medium hover:underline">
              {t('helpText.helpCenter')}
            </TransitionLink>{' '}
            {t('helpText.middleText')}{' '}
            <a href="mailto:support@puppy.az" className="text-black font-medium hover:underline">
              {t('helpText.contactUs')}
            </a>
            .
          </Text>
        </div>
      </div>
    </section>
  );
};

export default NavigationHelpSection;
