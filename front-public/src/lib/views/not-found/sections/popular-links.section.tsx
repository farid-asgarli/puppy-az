'use client';

import { IconHeart, IconHelpCircle, IconInfoCircle, IconStar, IconUserCircle, IconShieldCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import TransitionLink from '@/lib/components/transition-link';
import type { Icon as TablerIcon } from '@tabler/icons-react';

interface PopularLinksSectionProps {
  className?: string;
}

interface PopularLink {
  href: string;
  title: string;
  description: string;
  icon: TablerIcon;
}

export const PopularLinksSection: React.FC<PopularLinksSectionProps> = ({ className }) => {
  const t = useTranslations('notFound.popularLinks');

  const popularLinks: PopularLink[] = [
    {
      href: '/ads/favorites',
      title: t('links.favorites.title'),
      description: t('links.favorites.description'),
      icon: IconHeart,
    },
    {
      href: '/my-account',
      title: t('links.myAccount.title'),
      description: t('links.myAccount.description'),
      icon: IconUserCircle,
    },
    {
      href: '/premium',
      title: t('links.premium.title'),
      description: t('links.premium.description'),
      icon: IconStar,
    },
    {
      href: '/help',
      title: t('links.help.title'),
      description: t('links.help.description'),
      icon: IconHelpCircle,
    },
    {
      href: '/about',
      title: t('links.about.title'),
      description: t('links.about.description'),
      icon: IconInfoCircle,
    },
    {
      href: '/privacy',
      title: t('links.privacy.title'),
      description: t('links.privacy.description'),
      icon: IconShieldCheck,
    },
  ];

  return (
    <section className={cn('py-12 lg:py-16 bg-white', className)}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-12">
          <Heading variant="section" as="h2" className="mb-3">
            {t('title')}
          </Heading>
          <Text variant="body-lg" color="secondary">
            {t('subtitle')}
          </Text>
        </div>

        {/* Popular Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {popularLinks.map((link) => {
            const Icon = link.icon;
            return (
              <TransitionLink key={link.href} href={link.href} className="group">
                <div
                  className={cn(
                    'h-full p-5 sm:p-6 rounded-xl border-2 border-gray-200',
                    'transition-all duration-200 hover:border-black hover:shadow-md',
                    'space-y-3 sm:space-y-4'
                  )}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-black/5 transition-colors"
                    aria-hidden="true"
                  >
                    <Icon size={20} className="sm:w-6 sm:h-6 text-gray-700" />
                  </div>

                  {/* Content */}
                  <div>
                    <Heading variant="card" className="mb-2 text-base sm:text-lg group-hover:text-black transition-colors">
                      {link.title}
                    </Heading>
                    <Text variant="body" color="secondary" className="text-sm sm:text-base">
                      {link.description}
                    </Text>
                  </div>
                </div>
              </TransitionLink>
            );
          })}
        </div>

        {/* Fun Footer Note */}
        <div className="mt-10 lg:mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full">
            <span className="text-xl" role="img" aria-label="Bala">
              🐾
            </span>
            <Text variant="small" className="text-gray-700">
              {t('promotionalText')}
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularLinksSection;
