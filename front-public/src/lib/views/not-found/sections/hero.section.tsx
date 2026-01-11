'use client';

import { Heading, Text } from '@/lib/primitives/typography';
import { cn } from '@/lib/external/utils';
import ErrorStateDogAnimation from '@/lib/components/animations/error-state';
import { useTranslations } from 'next-intl';

interface NotFoundHeroSectionProps {
  className?: string;
}

export const NotFoundHeroSection: React.FC<NotFoundHeroSectionProps> = ({ className }) => {
  const t = useTranslations('notFound.hero');
  const tAccessibility = useTranslations('accessibility');
  return (
    <section className={cn('py-16 lg:py-24', className)}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* 404 Number - Decorative */}
        <div className="mb-8 lg:mb-12">
          <div className="inline-block relative">
            <span className="font-heading font-bold text-[120px] lg:text-[180px] leading-none text-gray-100 select-none" aria-hidden="true">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading font-semibold text-2xl lg:text-3xl text-gray-800">{t('oops')}</span>
            </div>
          </div>
        </div>

        {/* Lottie Animation Container */}
        <div className="mb-8 lg:mb-12 flex justify-center">
          <div
            className={cn('w-64 h-64 lg:w-80 lg:h-80 rounded-3xl transition-opacity duration-500')}
            aria-label={tAccessibility('lostPuppyAnimation')}
          >
            <ErrorStateDogAnimation />
          </div>
        </div>

        {/* Main Heading */}
        <Heading variant="page-title" as="h1" className="mb-4 lg:mb-6">
          {t('title')}
        </Heading>

        {/* Description */}
        <Text variant="body" color="secondary" className="text-lg lg:text-xl max-w-xl mx-auto mb-8 lg:mb-10">
          {t('description')}
        </Text>

        {/* Helpful Subtext */}
        <div className="bg-orange-50 rounded-2xl p-6 max-w-md mx-auto">
          <Text variant="body" className="text-sm text-gray-700">
            <span className="font-medium">{t('tipLabel')}</span> {t('tipDescription')}
          </Text>
        </div>
      </div>
    </section>
  );
};

export default NotFoundHeroSection;
