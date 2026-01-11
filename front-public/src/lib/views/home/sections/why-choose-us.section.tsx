'use client';

import { IconShieldCheck, IconUsers, IconClock, IconHeart, IconTrendingUp, IconSparkles } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { SectionHeader } from '@/lib/components/views/common';
import { useTranslations } from 'next-intl';

export const WhyChooseUsSection = () => {
  const t = useTranslations('home.whyChooseUs');

  const features = [
    {
      icon: IconShieldCheck,
      title: t('features.safeShopping.title'),
      description: t('features.safeShopping.description'),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      icon: IconUsers,
      title: t('features.verifiedSellers.title'),
      description: t('features.verifiedSellers.description'),
      color: 'from-info-500 to-info-600',
      bgColor: 'bg-info-50',
      iconColor: 'text-info-600',
      borderColor: 'border-info-200',
    },
    {
      icon: IconClock,
      title: t('features.support.title'),
      description: t('features.support.description'),
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      borderColor: 'border-primary-200',
    },
    {
      icon: IconHeart,
      title: t('features.care.title'),
      description: t('features.care.description'),
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50',
      iconColor: 'text-accent-600',
      borderColor: 'border-accent-200',
    },
    {
      icon: IconTrendingUp,
      title: t('features.largest.title'),
      description: t('features.largest.description'),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      icon: IconSparkles,
      title: t('features.easyUse.title'),
      description: t('features.easyUse.description'),
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
    },
  ];
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          {/* Section Header */}
          <SectionHeader title={t('title')} subtitle={t('subtitle')} layout="stacked" align="center" />

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className={cn(
                    'bg-white rounded-2xl border-2 p-6 sm:p-8 space-y-4',
                    'hover:border-gray-300 hover:shadow-lg',
                    'transition-all duration-200',
                    feature.borderColor
                  )}
                >
                  {/* Icon */}
                  <div className={cn('w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center', feature.bgColor)}>
                    <Icon size={32} className={feature.iconColor} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold font-heading text-gray-900">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Trust Message */}
          <div className="text-center pt-4 sm:pt-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-base sm:text-lg text-gray-700 font-medium">{t('activeUsers')}</p>
              <p className="text-sm sm:text-base text-gray-600">{t('platformDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
