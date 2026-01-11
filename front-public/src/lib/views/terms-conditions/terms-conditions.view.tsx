'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconAlertTriangle, IconMail } from '@tabler/icons-react';
import { getTermsData, getTermsSections } from '@/lib/data/terms';
import { RichTextRenderer } from '@/lib/components/views/terms-conditions';
import { InfoBanner, PageHeader } from '@/lib/components/views/common';
import { AccordionItem } from '@/lib/components/views/common/accordion';

const TermsConditionsView = () => {
  const t = useTranslations('terms');
  const tTerms = useTranslations();
  const [expandedSections, setExpandedSections] = useState<Partial<Record<string, boolean>>>({});

  const terms_data = getTermsData((key) => tTerms(key));
  const terms_sections = getTermsSections((key) => tTerms(key));

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PageHeader
        title={t('title')}
        subtitle={t('lastUpdated', { date: terms_data.lastUpdated })}
        maxWidth="xl"
        className="sticky top-0 z-10 bg-white"
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Important Notice */}
          <InfoBanner
            variant="warning"
            icon={IconAlertTriangle}
            title={t('banner.title')}
            description={t('banner.description', { date: terms_data.effectiveDate })}
          />

          {/* Terms Sections */}
          <div className="space-y-3 sm:space-y-4">
            {terms_sections.map((section) => (
              <AccordionItem
                key={section.id}
                id={section.id}
                title={section.title}
                icon={section.icon}
                isExpanded={expandedSections[section.id] || false}
                onToggle={() => toggleSection(section.id)}
              >
                <RichTextRenderer content={section.content} />
              </AccordionItem>
            ))}
          </div>

          {/* Contact Info */}
          <InfoBanner
            variant="info"
            icon={IconMail}
            title={t('contact.title')}
            description={
              <>
                {t('contact.description')}
                <span className="font-semibold"> {terms_data.contactEmail}</span>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsView;
