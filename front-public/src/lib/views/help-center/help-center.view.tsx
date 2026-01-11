'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconSearch } from '@tabler/icons-react';
import { getHelpData, getHelpCategories } from '@/lib/data/help';
import TransitionLink from '@/lib/components/transition-link';
import { SearchInput, EmptyState, PageHeader } from '@/lib/components/views/common';
import { ContactBanner } from '@/lib/components/views/help-center/contact-banner/contact-banner.component';
import { FilterChip } from '@/lib/components/views/help-center/filter-chip/filter-chip.component';
import { FAQCategory } from '@/lib/components/views/help-center/faq-category/faq-category.component';

const HelpCenterView = () => {
  const t = useTranslations();
  const tNav = useTranslations('navigation');
  const tCommon = useTranslations('common');

  const help_data = getHelpData(t);
  const help_categories = getHelpCategories(t);

  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (categoryId: string, faqIndex: number) => {
    const key = `${categoryId}-${faqIndex}`;
    setExpandedFaqs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter FAQs based on search query
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) {
      return selectedCategory ? help_categories.filter((cat) => cat.id === selectedCategory) : help_categories;
    }

    const query = searchQuery.toLowerCase();
    return help_categories
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter((faq) => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)),
      }))
      .filter((category) => category.faqs.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      <PageHeader title={tNav('help')} subtitle={t('helpCenter.subtitle')} maxWidth="2xl" />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('helpCenter.searchPlaceholder')}
            size="lg"
            className="max-w-2xl"
          />

          {/* Contact Banner */}
          <ContactBanner
            title={t('helpCenter.contactBanner.title')}
            description={t('helpCenter.contactBanner.description')}
            email={help_data.supportEmail}
            phone={help_data.phoneNumber}
            workingHours={help_data.workingHours}
          />

          {/* Category Filter Chips */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <FilterChip label={tCommon('all')} selected={selectedCategory === null} onClick={() => setSelectedCategory(null)} />
              {help_categories.map((category) => (
                <FilterChip
                  key={category.id}
                  label={category.title}
                  icon={category.icon}
                  selected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
          )}

          {/* Categories and FAQs */}
          <div className="space-y-4 sm:space-y-6">
            {filteredCategories.length === 0 ? (
              <EmptyState
                icon={IconSearch}
                title={tCommon('noResults')}
                message={t('helpCenter.noResultsMessage')}
                className="bg-gray-50 rounded-xl border-2 border-gray-200"
              />
            ) : (
              filteredCategories.map((category) => (
                <FAQCategory
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  categoryId={category.id}
                  faqs={category.faqs}
                  expandedFaqs={expandedFaqs}
                  onToggleFaq={toggleFaq}
                />
              ))
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-4 text-center text-xs sm:text-sm text-gray-500">
            <p>
              {t('helpCenter.lastUpdated')}: {help_data.lastUpdated} •{' '}
              <TransitionLink href="/privacy" className="text-gray-700 hover:text-gray-900 hover:underline">
                {tNav('privacy')}
              </TransitionLink>{' '}
              •{' '}
              <TransitionLink href="/terms" className="text-gray-700 hover:text-gray-900 hover:underline">
                {tNav('terms')}
              </TransitionLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterView;
