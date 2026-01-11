'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  IconCrown,
  IconRocket,
  IconTrendingUp,
  IconEye,
  IconBolt,
  IconSparkles,
  IconCheck,
  IconX,
  IconMessageCircle,
  IconMail,
  IconAlertCircle,
  IconChartBar,
  IconClock,
} from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import TransitionLink from '@/lib/components/transition-link';
import Button from '@/lib/primitives/button/button.component';

const PremiumAdView = () => {
  const t = useTranslations('premium');
  const [selectedDuration, setSelectedDuration] = useState<'1month' | '3months' | '6months'>('1month');

  // Pricing based on duration
  const pricing = {
    '1month': { price: 19.99, discount: 0, total: 19.99 },
    '3months': { price: 19.99, discount: 15, total: 50.97 }, // 19.99 * 3 * 0.85
    '6months': { price: 19.99, discount: 25, total: 89.94 }, // 19.99 * 6 * 0.75
  };

  const benefits = [
    {
      icon: IconRocket,
      title: t('benefits.featured.title'),
      description: t('benefits.featured.description'),
      color: 'blue',
    },
    {
      icon: IconCrown,
      title: t('benefits.badge.title'),
      description: t('benefits.badge.description'),
      color: 'purple',
    },
    {
      icon: IconEye,
      title: t('benefits.visibility.title'),
      description: t('benefits.visibility.description'),
      color: 'green',
    },
    {
      icon: IconTrendingUp,
      title: t('benefits.priority.title'),
      description: t('benefits.priority.description'),
      color: 'orange',
    },
    {
      icon: IconChartBar,
      title: t('benefits.analytics.title'),
      description: t('benefits.analytics.description'),
      color: 'cyan',
    },
    {
      icon: IconSparkles,
      title: t('benefits.design.title'),
      description: t('benefits.design.description'),
      color: 'pink',
    },
  ];

  const stats = [
    { value: '5-7x', label: t('stats.fasterSale'), icon: IconBolt },
    { value: '10x', label: t('stats.moreViews'), icon: IconEye },
    { value: '95%', label: t('stats.satisfaction'), icon: IconCheck },
    { value: '48 ' + t('stats.hours'), label: t('stats.avgSaleTime'), icon: IconClock },
  ];

  const comparisonFeatures = [
    { feature: t('comparison.adPosting'), free: true, premium: true },
    { feature: t('comparison.standardVisibility'), free: true, premium: false },
    { feature: t('comparison.featured'), free: false, premium: true },
    { feature: t('comparison.premiumBadge'), free: false, premium: true },
    { feature: t('comparison.tenXVisibility'), free: false, premium: true },
    { feature: t('comparison.priorityPlacement'), free: false, premium: true },
    { feature: t('comparison.detailedAnalytics'), free: false, premium: true },
    { feature: t('comparison.customDesign'), free: false, premium: true },
    { feature: t('comparison.homepageDisplay'), free: false, premium: true },
  ];

  const faqs = [
    {
      question: t('faqs.whatIsPremium.question'),
      answer: t('faqs.whatIsPremium.answer'),
    },
    {
      question: t('faqs.howPayment.question'),
      answer: t('faqs.howPayment.answer'),
    },
    {
      question: t('faqs.duration.question'),
      answer: t('faqs.duration.answer'),
    },
    {
      question: t('faqs.effectiveness.question'),
      answer: t('faqs.effectiveness.answer'),
    },
    {
      question: t('faqs.multipleAds.question'),
      answer: t('faqs.multipleAds.answer'),
    },
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleContactAdmin = () => {
    console.log('Contact admin for premium ad upgrade');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900">{t('title')}</h1>
            <p className="text-base sm:text-lg text-gray-600">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {/* Hero Section */}
          <div className="space-y-6 sm:space-y-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-premium-50 border-2 border-premium-200 rounded-xl">
                <IconCrown size={20} className="text-premium-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-premium-700">{t('hero.badge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold font-heading text-gray-900 leading-tight px-4 sm:px-0">
                {t('hero.title')}
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">{t('hero.description')}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 text-center space-y-2 sm:space-y-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gray-100 flex items-center justify-center">
                    <stat.icon size={20} className="sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="text-center space-y-2 sm:space-y-3 px-4 sm:px-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900">{t('benefitsTitle')}</h2>
              <p className="text-base sm:text-lg text-gray-600">{t('benefitsSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 space-y-3 sm:space-y-4 hover:border-gray-400 transition-all duration-200"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <benefit.icon size={20} className="sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="text-center space-y-2 sm:space-y-3 px-4 sm:px-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900">{t('pricingTitle')}</h2>
              <p className="text-base sm:text-lg text-gray-600">{t('pricingSubtitle')}</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Duration Selection */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button
                  onClick={() => setSelectedDuration('1month')}
                  className={cn(
                    'flex-1 p-4 sm:p-6 rounded-xl border-2 transition-all duration-200',
                    selectedDuration === '1month' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  )}
                >
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{t('pricing.1month')}</div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{pricing['1month'].total} ₼</div>
                    <div className="text-xs sm:text-sm text-gray-600">{t('pricing.popularChoice')}</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedDuration('3months')}
                  className={cn(
                    'flex-1 p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 relative',
                    selectedDuration === '3months' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  )}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                    {t('pricing.discount', { percent: 15 })}
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{t('pricing.3months')}</div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{pricing['3months'].total} ₼</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {t('pricing.perMonth', { amount: (pricing['3months'].total / 3).toFixed(2) })}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedDuration('6months')}
                  className={cn(
                    'flex-1 p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 relative',
                    selectedDuration === '6months' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  )}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-premium-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                    {t('pricing.discount', { percent: 25 })}
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{t('pricing.6months')}</div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{pricing['6months'].total} ₼</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {t('pricing.perMonth', { amount: (pricing['6months'].total / 6).toFixed(2) })}
                    </div>
                  </div>
                </button>
              </div>

              {/* Selected Package Details */}
              <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-premium-50 via-accent-50 to-info-50 border-2 border-premium-200 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{t('selectedPackage.title')}</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {selectedDuration === '1month' && t('selectedPackage.1month')}
                      {selectedDuration === '3months' && t('selectedPackage.3months')}
                      {selectedDuration === '6months' && t('selectedPackage.6months')}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-3xl sm:text-4xl font-semibold text-gray-900">{pricing[selectedDuration].total} ₼</div>
                    {pricing[selectedDuration].discount > 0 && (
                      <div className="text-xs sm:text-sm text-green-600 font-medium mt-1">
                        {t('selectedPackage.discountApplied', { percent: pricing[selectedDuration].discount })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-premium-200">
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                      <IconCheck size={18} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span>{t('selectedPackage.features.0')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                      <IconCheck size={18} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span>{t('selectedPackage.features.1')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                      <IconCheck size={18} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span>{t('selectedPackage.features.2')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                      <IconCheck size={18} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span>{t('selectedPackage.features.3')}</span>
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full rounded-xl font-semibold text-sm sm:text-base"
                    leftSection={<IconMessageCircle size={18} className="sm:w-5 sm:h-5" />}
                    onClick={handleContactAdmin}
                  >
                    {t('contactAdmin')}
                  </Button>

                  <p className="text-xs sm:text-sm text-gray-600 text-center mt-4">{t('paymentNote')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="text-center space-y-2 sm:space-y-3 px-4 sm:px-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900">{t('comparisonTitle')}</h2>
              <p className="text-base sm:text-lg text-gray-600">{t('comparisonSubtitle')}</p>
            </div>

            <div className="max-w-4xl mx-auto overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0 overflow-hidden rounded-xl border-2 border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 sm:p-6 font-semibold text-sm sm:text-base text-gray-900">{t('comparisonTable.feature')}</th>
                      <th className="text-center p-4 sm:p-6 font-semibold text-sm sm:text-base text-gray-900">{t('comparisonTable.free')}</th>
                      <th className="text-center p-4 sm:p-6 font-semibold text-sm sm:text-base text-gray-900 bg-premium-50">
                        {t('comparisonTable.premium')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-4 sm:p-6 text-sm sm:text-base text-gray-700">{item.feature}</td>
                        <td className="p-4 sm:p-6 text-center">
                          {item.free ? (
                            <IconCheck size={20} className="sm:w-6 sm:h-6 text-green-600 mx-auto" />
                          ) : (
                            <IconX size={20} className="sm:w-6 sm:h-6 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 sm:p-6 text-center bg-premium-50">
                          {item.premium ? (
                            <IconCheck size={20} className="sm:w-6 sm:h-6 text-green-600 mx-auto" />
                          ) : (
                            <IconX size={20} className="sm:w-6 sm:h-6 text-gray-300 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="text-center space-y-2 sm:space-y-3 px-4 sm:px-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900">{t('faqTitle')}</h2>
              <p className="text-base sm:text-lg text-gray-600">{t('faqSubtitle')}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-xl border-2 border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">{faq.question}</h3>
                    <IconAlertCircle
                      size={18}
                      className={cn('sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 transition-transform', openFaqIndex === index && 'rotate-180')}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 lg:p-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white space-y-4 sm:space-y-6">
              <div className="max-w-2xl mx-auto text-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
                  <IconCrown size={24} className="sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading">{t('cta.title')}</h2>
                <p className="text-base sm:text-lg text-gray-300">{t('cta.description')}</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-xl font-semibold bg-white text-gray-900 hover:bg-gray-100 text-sm sm:text-base"
                    leftSection={<IconMessageCircle size={18} className="sm:w-5 sm:h-5" />}
                    onClick={handleContactAdmin}
                  >
                    {t('cta.chatButton')}
                  </Button>
                  <TransitionLink
                    href="/help"
                    className={cn(
                      'inline-flex items-center justify-center gap-2',
                      'px-4 sm:px-6 py-3 rounded-xl border-2 border-white/20',
                      'hover:bg-white/10 transition-colors duration-200',
                      'font-semibold text-white text-sm sm:text-base'
                    )}
                  >
                    <IconMail size={18} className="sm:w-5 sm:h-5" />
                    <span>{t('cta.helpCenter')}</span>
                  </TransitionLink>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-white/10">
                  <p className="text-xs sm:text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: t.raw('cta.contactEmail') }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAdView;
