'use client';

import { useState } from 'react';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import Button from '@/lib/primitives/button/button.component';
import { useViewTransition } from '@/lib/hooks/use-view-transition';

interface SearchBarSectionProps {
  className?: string;
}

export const SearchBarSection: React.FC<SearchBarSectionProps> = ({ className }) => {
  const t = useTranslations('notFound.searchBar');
  const [searchQuery, setSearchQuery] = useState('');
  const { navigateWithTransition } = useViewTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to ads search page with query
      navigateWithTransition(`/ads?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSearches = [
    t('popularSearches.goldenRetriever'),
    t('popularSearches.germanShepherd'),
    t('popularSearches.labrador'),
    t('popularSearches.persianCat'),
    t('popularSearches.britishCat'),
  ];

  return (
    <section className={cn('py-12 lg:py-16 bg-gradient-to-br from-highlight-50 to-accent-50', className)}>
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-10">
          <Heading variant="section" as="h2" className="mb-3">
            {t('title')}
          </Heading>
          <Text variant="body-lg" color="secondary">
            {t('subtitle')}
          </Text>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full h-16 rounded-2xl border-2 border-gray-300',
                'pl-14 pr-4 text-base lg:text-lg',
                'focus:border-black focus:outline-none transition-colors',
                'placeholder:text-gray-400 bg-white shadow-sm'
              )}
              aria-label={t('ariaLabel')}
            />
            <IconSearch size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full rounded-2xl font-medium shadow-md hover:shadow-lg transition-shadow"
            rightSection={<IconArrowRight size={20} />}
            disabled={!searchQuery.trim()}
          >
            {t('searchButton')}
          </Button>
        </form>

        {/* Quick Search Suggestions */}
        <div className="mt-8">
          <Text variant="small" color="secondary" className="mb-3 text-center">
            {t('popularSearchesLabel')}
          </Text>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setSearchQuery(suggestion);
                  navigateWithTransition(`/ads?q=${encodeURIComponent(suggestion)}`);
                }}
                className={cn(
                  'px-4 py-2 rounded-full bg-white border-2 border-gray-200',
                  'text-sm font-medium text-gray-700',
                  'hover:border-black hover:bg-gray-50 transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Fun Encouragement */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
            <span className="text-2xl" role="img" aria-label={t('encouragement.ariaLabel')}>
              💝
            </span>
            <Text variant="small" className="text-gray-700 font-medium">
              {t('encouragement.text')}
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBarSection;
