import {
  IconQuestionMark,
  IconShoppingCart,
  IconPhoto,
  IconCreditCard,
  IconShield,
  IconMessageCircle,
  IconUserCircle,
  IconAlertCircle,
} from '@tabler/icons-react';

// Translation keys for help data
export const getHelpData = (t: (key: string) => string) => ({
  lastUpdated: t('help.data.lastUpdated'),
  supportEmail: t('help.data.supportEmail'),
  phoneNumber: t('help.data.phoneNumber'),
  workingHours: t('help.data.workingHours'),
});

export const getHelpCategories = (t: (key: string) => string) => [
  {
    id: 'getting-started',
    title: t('help.categories.gettingStarted.title'),
    icon: IconQuestionMark,
    description: t('help.categories.gettingStarted.description'),
    faqs: [
      {
        question: t('help.categories.gettingStarted.faqs.whatIsPuppy.question'),
        answer: t('help.categories.gettingStarted.faqs.whatIsPuppy.answer'),
      },
      {
        question: t('help.categories.gettingStarted.faqs.howToRegister.question'),
        answer: t('help.categories.gettingStarted.faqs.howToRegister.answer'),
      },
      {
        question: t('help.categories.gettingStarted.faqs.isFree.question'),
        answer: t('help.categories.gettingStarted.faqs.isFree.answer'),
      },
      {
        question: t('help.categories.gettingStarted.faqs.mobileApp.question'),
        answer: t('help.categories.gettingStarted.faqs.mobileApp.answer'),
      },
    ],
  },
  {
    id: 'posting-ads',
    title: t('help.categories.postingAds.title'),
    icon: IconPhoto,
    description: t('help.categories.postingAds.description'),
    faqs: [
      {
        question: t('help.categories.postingAds.faqs.howToPost.question'),
        answer: t('help.categories.postingAds.faqs.howToPost.answer'),
      },
      {
        question: t('help.categories.postingAds.faqs.howManyPhotos.question'),
        answer: t('help.categories.postingAds.faqs.howManyPhotos.answer'),
      },
      {
        question: t('help.categories.postingAds.faqs.approvalTime.question'),
        answer: t('help.categories.postingAds.faqs.approvalTime.answer'),
      },
      {
        question: t('help.categories.postingAds.faqs.howToEdit.question'),
        answer: t('help.categories.postingAds.faqs.howToEdit.answer'),
      },
      {
        question: t('help.categories.postingAds.faqs.adDuration.question'),
        answer: t('help.categories.postingAds.faqs.adDuration.answer'),
      },
    ],
  },
  {
    id: 'buying-selling',
    title: t('help.categories.buyingSelling.title'),
    icon: IconShoppingCart,
    description: t('help.categories.buyingSelling.description'),
    faqs: [
      {
        question: t('help.categories.buyingSelling.faqs.howToContact.question'),
        answer: t('help.categories.buyingSelling.faqs.howToContact.answer'),
      },
      {
        question: t('help.categories.buyingSelling.faqs.howPayment.question'),
        answer: t('help.categories.buyingSelling.faqs.howPayment.answer'),
      },
      {
        question: t('help.categories.buyingSelling.faqs.beforeMeeting.question'),
        answer: t('help.categories.buyingSelling.faqs.beforeMeeting.answer'),
      },
      {
        question: t('help.categories.buyingSelling.faqs.avoidScams.question'),
        answer: t('help.categories.buyingSelling.faqs.avoidScams.answer'),
      },
    ],
  },
  {
    id: 'account-settings',
    title: t('help.categories.accountSettings.title'),
    icon: IconUserCircle,
    description: t('help.categories.accountSettings.description'),
    faqs: [
      {
        question: t('help.categories.accountSettings.faqs.changePassword.question'),
        answer: t('help.categories.accountSettings.faqs.changePassword.answer'),
      },
      {
        question: t('help.categories.accountSettings.faqs.forgotPassword.question'),
        answer: t('help.categories.accountSettings.faqs.forgotPassword.answer').replace('{supportEmail}', t('help.data.supportEmail')),
      },
      {
        question: t('help.categories.accountSettings.faqs.updateProfile.question'),
        answer: t('help.categories.accountSettings.faqs.updateProfile.answer'),
      },
      {
        question: t('help.categories.accountSettings.faqs.deleteAccount.question'),
        answer: t('help.categories.accountSettings.faqs.deleteAccount.answer'),
      },
    ],
  },
  {
    id: 'safety-security',
    title: t('help.categories.safetySecurity.title'),
    icon: IconShield,
    description: t('help.categories.safetySecurity.description'),
    faqs: [
      {
        question: t('help.categories.safetySecurity.faqs.isDataSafe.question'),
        answer: t('help.categories.safetySecurity.faqs.isDataSafe.answer'),
      },
      {
        question: t('help.categories.safetySecurity.faqs.reportAd.question'),
        answer: t('help.categories.safetySecurity.faqs.reportAd.answer'),
      },
      {
        question: t('help.categories.safetySecurity.faqs.prohibitedAds.question'),
        answer: t('help.categories.safetySecurity.faqs.prohibitedAds.answer'),
      },
    ],
  },
  {
    id: 'payments-pricing',
    title: t('help.categories.paymentsPricing.title'),
    icon: IconCreditCard,
    description: t('help.categories.paymentsPricing.description'),
    faqs: [
      {
        question: t('help.categories.paymentsPricing.faqs.isPaid.question'),
        answer: t('help.categories.paymentsPricing.faqs.isPaid.answer'),
      },
      {
        question: t('help.categories.paymentsPricing.faqs.premiumAds.question'),
        answer: t('help.categories.paymentsPricing.faqs.premiumAds.answer'),
      },
    ],
  },
  {
    id: 'technical-support',
    title: t('help.categories.technicalSupport.title'),
    icon: IconAlertCircle,
    description: t('help.categories.technicalSupport.description'),
    faqs: [
      {
        question: t('help.categories.technicalSupport.faqs.technicalIssue.question'),
        answer: t('help.categories.technicalSupport.faqs.technicalIssue.answer')
          .replace('{supportEmail}', t('help.data.supportEmail'))
          .replace('{phoneNumber}', t('help.data.phoneNumber'))
          .replace('{workingHours}', t('help.data.workingHours')),
      },
      {
        question: t('help.categories.technicalSupport.faqs.photoUpload.question'),
        answer: t('help.categories.technicalSupport.faqs.photoUpload.answer'),
      },
      {
        question: t('help.categories.technicalSupport.faqs.emailNotifications.question'),
        answer: t('help.categories.technicalSupport.faqs.emailNotifications.answer'),
      },
      {
        question: t('help.categories.technicalSupport.faqs.contactSupport.question'),
        answer: t('help.categories.technicalSupport.faqs.contactSupport.answer')
          .replace('{supportEmail}', t('help.data.supportEmail'))
          .replace('{phoneNumber}', t('help.data.phoneNumber'))
          .replace('{workingHours}', t('help.data.workingHours')),
      },
    ],
  },
  {
    id: 'other',
    title: t('help.categories.other.title'),
    icon: IconMessageCircle,
    description: t('help.categories.other.description'),
    faqs: [
      {
        question: t('help.categories.other.faqs.whoRuns.question'),
        answer: t('help.categories.other.faqs.whoRuns.answer'),
      },
      {
        question: t('help.categories.other.faqs.commercialUse.question'),
        answer: t('help.categories.other.faqs.commercialUse.answer').replace('{supportEmail}', t('help.data.supportEmail')),
      },
      {
        question: t('help.categories.other.faqs.languageSupport.question'),
        answer: t('help.categories.other.faqs.languageSupport.answer'),
      },
      {
        question: t('help.categories.other.faqs.feedback.question'),
        answer: t('help.categories.other.faqs.feedback.answer')
          .replace('{supportEmail}', t('help.data.supportEmail'))
          .replace('{phoneNumber}', t('help.data.phoneNumber')),
      },
    ],
  },
];
