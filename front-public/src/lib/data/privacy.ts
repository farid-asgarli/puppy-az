import { IconDatabase, IconEye, IconUserCheck, IconLock } from '@tabler/icons-react';

// Translation keys for privacy data
export const getPrivacyData = (t: (key: string) => string) => ({
  lastUpdated: t('privacy.data.lastUpdated'),
  effectiveDate: t('privacy.data.effectiveDate'),
  companyName: t('privacy.data.companyName'),
  website: t('privacy.data.website'),
  contactEmail: t('privacy.data.contactEmail'),
  supportEmail: t('privacy.data.supportEmail'),
});

export const getPrivacySections = (t: (key: string) => string) => [
  {
    id: 'data-collection',
    title: t('privacy.sections.dataCollection.title'),
    icon: IconDatabase,
    content: t('privacy.sections.dataCollection.content'),
  },
  {
    id: 'data-usage',
    title: t('privacy.sections.dataUsage.title'),
    icon: IconEye,
    content: t('privacy.sections.dataUsage.content'),
  },
  {
    id: 'data-sharing',
    title: t('privacy.sections.dataSharing.title'),
    icon: IconUserCheck,
    content: t('privacy.sections.dataSharing.content'),
  },
  {
    id: 'data-security',
    title: t('privacy.sections.dataSecurity.title'),
    icon: IconLock,
    content: t('privacy.sections.dataSecurity.content'),
  },
];
