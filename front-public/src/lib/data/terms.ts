import { IconCheck, IconUsers } from '@tabler/icons-react';

// Translation keys for terms data
export const getTermsData = (t: (key: string) => string) => ({
  lastUpdated: t('terms.data.lastUpdated'),
  effectiveDate: t('terms.data.effectiveDate'),
  companyName: t('terms.data.companyName'),
  website: t('terms.data.website'),
  contactEmail: t('terms.data.contactEmail'),
  supportEmail: t('terms.data.supportEmail'),
});

export const getTermsSections = (t: (key: string) => string) => [
  {
    id: 'acceptance',
    title: t('terms.sections.acceptance.title'),
    icon: IconCheck,
    content: t('terms.sections.acceptance.content'),
  },
  {
    id: 'services',
    title: t('terms.sections.services.title'),
    icon: IconUsers,
    content: t('terms.sections.services.content'),
  },
];

// Legacy exports for backward compatibility (deprecated)
export const terms_data = {
  lastUpdated: '15 Avqust 2025',
  effectiveDate: '1 Yanvar 2025',
  companyName: 'PetMarket',
  website: 'petmarket.az',
  contactEmail: 'info@petmarket.az',
  supportEmail: 'support@petmarket.az',
};
