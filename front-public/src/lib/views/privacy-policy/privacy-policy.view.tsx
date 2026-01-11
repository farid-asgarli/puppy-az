'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconShield, IconUserCheck, IconMail } from '@tabler/icons-react';
import { getPrivacyData, getPrivacySections } from '@/lib/data/privacy';
import { RichTextRenderer, UserRightsList } from '@/lib/components/views/terms-conditions';
import { InfoBanner, PageHeader } from '@/lib/components/views/common';
import { AccordionItem } from '@/lib/components/views/common/accordion';

const PrivacyPolicyView = () => {
  const t = useTranslations('privacyPolicy');
  const tPrivacy = useTranslations();
  const [expandedSections, setExpandedSections] = useState<Partial<Record<string, boolean>>>({});

  const privacy_data = getPrivacyData((key) => tPrivacy(key));
  const privacy_sections = getPrivacySections((key) => tPrivacy(key));

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
        subtitle={t('lastUpdated', { date: privacy_data.lastUpdated })}
        maxWidth="xl"
        className="sticky top-0 z-10 bg-white"
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Important Notice */}
          <InfoBanner
            variant="info"
            icon={IconShield}
            title={t('banner.title')}
            description={t('banner.description', { date: privacy_data.effectiveDate })}
          />

          {/* Privacy Sections */}
          <div className="space-y-3 sm:space-y-4">
            {privacy_sections.map((section) => (
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

          {/* Your Rights Section */}
          <InfoBanner
            variant="success"
            icon={IconUserCheck}
            title={t('rights.title')}
            description={
              <UserRightsList
                rights={[
                  { label: t('rights.list.access'), description: t('rights.descriptions.access') },
                  { label: t('rights.list.correct'), description: t('rights.descriptions.correct') },
                  { label: t('rights.list.delete'), description: t('rights.descriptions.delete') },
                  { label: t('rights.list.transfer'), description: t('rights.descriptions.transfer') },
                  { label: t('rights.list.object'), description: t('rights.descriptions.object') },
                ]}
                className="text-green-800"
              />
            }
          />

          {/* Contact Info */}
          <InfoBanner
            variant="info"
            icon={IconMail}
            title={t('contact.title')}
            description={
              <>
                {t('contact.description')}
                <span className="font-semibold"> {privacy_data.contactEmail}</span>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyView;
