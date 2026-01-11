'use client';

import { useState } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import TransitionLink from '@/lib/components/transition-link';
import {
  IconDeviceMobile,
  IconWorld,
  IconBell,
  IconMail,
  IconBrandWhatsapp,
  IconMessageCircle,
  IconPhone,
  IconEye,
  IconSearch,
  IconCookie,
  IconChartBar,
  IconDownload,
  IconFileText,
  IconTrash,
} from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import { SettingToggleItem } from '@/lib/components/views/my-account/setting-item/setting-toggle-item.component';
import { SettingActionItem } from '@/lib/components/views/my-account/setting-item/setting-action-item.component';
import { PageHeader, InfoBanner } from '@/lib/components/views/common';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/lib/hooks/use-client-locale';

const SettingsView = () => {
  const t = useTranslations('myAccountPages.settings');
  const tSettings = useTranslations('settings');
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from URL params
  const currentLocale = useLocale();

  // App Settings
  // const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState<string>(currentLocale);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  // Notification Types
  const [notifyNewMessages, setNotifyNewMessages] = useState(true);
  const [notifyAdUpdates, setNotifyAdUpdates] = useState(true);
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyNewMatches, setNotifyNewMatches] = useState(false);
  const [notifyMarketingEmails, setNotifyMarketingEmails] = useState(false);

  // Privacy Settings
  const [showPhoneNumber, setShowPhoneNumber] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearch, setAllowSearch] = useState(true);

  // Data & Privacy
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);

  // Handle language change
  const handleLanguageChange = (newLocale: string) => {
    setLanguage(newLocale);
    // Navigate to the same page but with new locale
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1: PAGE HEADER */}
      <PageHeader title={t('pageTitle')} subtitle={t('pageSubtitle')} maxWidth="3xl" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {/* SECTION 2: APP PREFERENCES */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 pb-12 sm:pb-16 lg:pb-20 border-b border-gray-100">
            <div className="space-y-6 sm:space-y-8">
              {/* Theme Selection */}
              <div className="space-y-3 sm:space-y-4">
                {/* <div className="space-y-1 sm:space-y-2">
                  <Heading variant="subsection" as="h2">
                    {tSettings('appearance.title')}
                  </Heading>
                  <Text variant="body" color="secondary">
                    {tSettings('appearance.subtitle')}
                  </Text>
                </div> */}

                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      'p-4 sm:p-6 rounded-xl border-2 transition-all duration-200',
                      'flex flex-col items-center gap-2 sm:gap-3 text-center',
                      theme === 'light' ? 'border-gray-900 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center',
                        theme === 'light' ? 'bg-gray-900' : 'bg-gray-100'
                      )}
                    >
                      <IconSun size={24} className="sm:w-7 sm:h-7" color={theme === 'light' ? 'white' : undefined} />
                    </div>
                    <div>
                      <div className={cn('font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base', theme === 'light' ? 'text-gray-900' : 'text-gray-700')}>
                        {tSettings('appearance.light.title')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{tSettings('appearance.light.description')}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'p-4 sm:p-6 rounded-xl border-2 transition-all duration-200',
                      'flex flex-col items-center gap-2 sm:gap-3 text-center',
                      theme === 'dark' ? 'border-gray-900 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center',
                        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                      )}
                    >
                      <IconMoon size={24} className="sm:w-7 sm:h-7" color={theme === 'dark' ? 'white' : undefined} />
                    </div>
                    <div>
                      <div className={cn('font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base', theme === 'dark' ? 'text-gray-900' : 'text-gray-700')}>
                        {tSettings('appearance.dark.title')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{tSettings('appearance.dark.description')}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme('system')}
                    className={cn(
                      'p-4 sm:p-6 rounded-xl border-2 transition-all duration-200',
                      'flex flex-col items-center gap-2 sm:gap-3 text-center',
                      theme === 'system' ? 'border-gray-900 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center',
                        theme === 'system' ? 'bg-gray-900' : 'bg-gray-100'
                      )}
                    >
                      <IconDeviceMobile size={24} className="sm:w-7 sm:h-7" color={theme === 'system' ? 'white' : undefined} />
                    </div>
                    <div>
                      <div
                        className={cn('font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base', theme === 'system' ? 'text-gray-900' : 'text-gray-700')}
                      >
                        {t('themeSystem')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{t('themeSystemDesc')}</div>
                    </div>
                  </button>
                </div> */}
              </div>

              {/* Language Selection */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Heading variant="subsection" as="h2">
                    {t('languageTitle')}
                  </Heading>
                  <Text variant="body" color="secondary">
                    {tSettings('language.interfaceLanguage')}
                  </Text>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <button
                    onClick={() => handleLanguageChange('az')}
                    className={cn(
                      'p-4 sm:p-6 rounded-xl border-2 transition-all duration-200',
                      'flex items-center gap-3 sm:gap-4',
                      language === 'az' ? 'border-gray-900 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        language === 'az' ? 'bg-gray-900' : 'bg-gray-100'
                      )}
                    >
                      <IconWorld size={20} className="sm:w-6 sm:h-6" color={language === 'az' ? 'white' : undefined} />
                    </div>
                    <div className="text-left">
                      <div className={cn('font-semibold text-sm sm:text-base', language === 'az' ? 'text-gray-900' : 'text-gray-700')}>
                        {tSettings('language.azerbaijani')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{tSettings('language.azerbaijani')}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={cn(
                      'p-4 sm:p-6 rounded-xl border-2 transition-all duration-200',
                      'flex items-center gap-3 sm:gap-4',
                      language === 'en' ? 'border-gray-900 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        language === 'en' ? 'bg-gray-900' : 'bg-gray-100'
                      )}
                    >
                      <IconWorld size={20} className="sm:w-6 sm:h-6" color={language === 'en' ? 'white' : undefined} />
                    </div>
                    <div className="text-left">
                      <div className={cn('font-semibold text-sm sm:text-base', language === 'en' ? 'text-gray-900' : 'text-gray-700')}>
                        {t('langEnglish')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{t('langEnglishDesc')}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLanguageChange('ru')}
                    className={cn(
                      'p-4 sm:p-6 rounded-xl border-2 transition-all duration-200',
                      'flex items-center gap-3 sm:gap-4',
                      language === 'ru' ? 'border-gray-900 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        language === 'ru' ? 'bg-gray-900' : 'bg-gray-100'
                      )}
                    >
                      <IconWorld size={20} className="sm:w-6 sm:h-6" color={language === 'ru' ? 'white' : undefined} />
                    </div>
                    <div className="text-left">
                      <div className={cn('font-semibold text-sm sm:text-base', language === 'ru' ? 'text-gray-900' : 'text-gray-700')}>
                        {t('langRussian')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{t('langRussianDesc')}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: NOTIFICATION SETTINGS */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 pb-12 sm:pb-16 lg:pb-20 border-b border-gray-100">
            <div className="space-y-6 sm:space-y-8">
              {/* Notification Channels */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Heading variant="subsection" as="h2">
                    {tSettings('notificationChannels.title')}
                  </Heading>
                  <Text variant="body" color="secondary">
                    {tSettings('notificationChannels.subtitle')}
                  </Text>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <SettingToggleItem
                    icon={IconMail}
                    label={tSettings('notificationChannels.email.label')}
                    description={tSettings('notificationChannels.email.description')}
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                  />
                  <SettingToggleItem
                    icon={IconBell}
                    label={tSettings('notificationChannels.push.label')}
                    description={tSettings('notificationChannels.push.description')}
                    checked={pushNotifications}
                    onChange={setPushNotifications}
                  />
                  <SettingToggleItem
                    icon={IconDeviceMobile}
                    label={tSettings('notificationChannels.sms.label')}
                    description={tSettings('notificationChannels.sms.description')}
                    checked={smsNotifications}
                    onChange={setSmsNotifications}
                  />
                  <SettingToggleItem
                    icon={IconBrandWhatsapp}
                    label={tSettings('notificationChannels.whatsapp.label')}
                    description={tSettings('notificationChannels.whatsapp.description')}
                    checked={whatsappNotifications}
                    onChange={setWhatsappNotifications}
                  />
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Heading variant="subsection" as="h2">
                    {tSettings('notificationTypes.title')}
                  </Heading>
                  <Text variant="body" color="secondary">
                    {tSettings('notificationTypes.subtitle')}
                  </Text>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <SettingToggleItem
                    icon={IconMessageCircle}
                    label={tSettings('notificationTypes.newMessages.label')}
                    description={tSettings('notificationTypes.newMessages.description')}
                    checked={notifyNewMessages}
                    onChange={setNotifyNewMessages}
                  />
                  <SettingToggleItem
                    icon={IconBell}
                    label={tSettings('notificationTypes.adUpdates.label')}
                    description={tSettings('notificationTypes.adUpdates.description')}
                    checked={notifyAdUpdates}
                    onChange={setNotifyAdUpdates}
                  />
                  <SettingToggleItem
                    icon={IconBell}
                    label={tSettings('notificationTypes.priceDrops.label')}
                    description={tSettings('notificationTypes.priceDrops.description')}
                    checked={notifyPriceDrops}
                    onChange={setNotifyPriceDrops}
                  />
                  <SettingToggleItem
                    icon={IconBell}
                    label={tSettings('notificationTypes.newMatches.label')}
                    description={tSettings('notificationTypes.newMatches.description')}
                    checked={notifyNewMatches}
                    onChange={setNotifyNewMatches}
                  />
                  <SettingToggleItem
                    icon={IconMail}
                    label={tSettings('notificationTypes.marketingEmails.label')}
                    description={tSettings('notificationTypes.marketingEmails.description')}
                    checked={notifyMarketingEmails}
                    onChange={setNotifyMarketingEmails}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PRIVACY SETTINGS */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 pb-12 sm:pb-16 lg:pb-20 border-b border-gray-100">
            <div className="space-y-6 sm:space-y-8">
              {/* Profile Privacy */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Heading variant="subsection" as="h2">
                    {tSettings('privacy.title')}
                  </Heading>
                  <Text variant="body" color="secondary">
                    {tSettings('privacy.subtitle')}
                  </Text>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <SettingToggleItem
                    icon={IconPhone}
                    label={tSettings('privacy.showPhone.label')}
                    description={tSettings('privacy.showPhone.description')}
                    checked={showPhoneNumber}
                    onChange={setShowPhoneNumber}
                  />
                  <SettingToggleItem
                    icon={IconMail}
                    label={t('showEmail')}
                    description={t('showEmailDesc')}
                    checked={showEmail}
                    onChange={setShowEmail}
                  />
                  <SettingToggleItem
                    icon={IconEye}
                    label={t('showOnlineStatus')}
                    description={t('showOnlineStatusDesc')}
                    checked={showOnlineStatus}
                    onChange={setShowOnlineStatus}
                  />
                  <SettingToggleItem
                    icon={IconSearch}
                    label={tSettings('privacy.showInSearch.label')}
                    description={tSettings('privacy.showInSearch.description')}
                    checked={allowSearch}
                    onChange={setAllowSearch}
                  />
                </div>
              </div>

              {/* Data & Analytics */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Heading variant="subsection" as="h2">
                    {tSettings('dataAnalytics.title')}
                  </Heading>
                  <Text variant="body" color="secondary">
                    {tSettings('dataAnalytics.subtitle')}
                  </Text>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <SettingToggleItem
                    icon={IconChartBar}
                    label={tSettings('dataAnalytics.analytics.label')}
                    description={tSettings('dataAnalytics.analytics.description')}
                    checked={analyticsEnabled}
                    onChange={setAnalyticsEnabled}
                  />
                  <SettingToggleItem
                    icon={IconCookie}
                    label={tSettings('dataAnalytics.personalization.label')}
                    description={tSettings('dataAnalytics.personalization.description')}
                    checked={personalizationEnabled}
                    onChange={setPersonalizationEnabled}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: DATA & PRIVACY */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 pb-12 sm:pb-16 lg:pb-20 border-b border-gray-100">
            <div className="space-y-6 sm:space-y-8">
              {/* Data Management */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Heading variant="subsection" as="h2">
                    {t('dataManagement.title')}
                  </Heading>
                  <Text variant="body" color="secondary">
                    {t('dataManagement.manageData.subtitle')}
                  </Text>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <SettingActionItem
                    icon={IconDownload}
                    title={t('dataManagement.downloadData.title')}
                    description={t('dataManagement.downloadData.description')}
                    actionLabel={t('dataManagement.downloadData.button')}
                    onAction={() => console.log('Download data')}
                  />

                  <SettingActionItem
                    icon={IconFileText}
                    title={t('dataManagement.dataUsage.title')}
                    description={t('dataManagement.dataUsage.description')}
                    actionLabel={t('dataManagement.dataUsage.button')}
                    onAction={() => console.log('View privacy policy')}
                  />
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Heading variant="subsection" as="h2" className="text-red-600">
                    {t('dangerZone.title')}
                  </Heading>
                  <Text variant="body" color="secondary">
                    {t('dangerZone.deleteAccount.warning')}
                  </Text>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <SettingActionItem
                    icon={IconTrash}
                    title={t('dangerZone.deleteAccount.title')}
                    description={t('dangerZone.deleteAccount.description')}
                    actionLabel={t('dangerZone.deleteAccount.button')}
                    actionVariant="danger"
                    onAction={() => console.log('Delete account')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: PRIVACY ASSURANCE */}
          <InfoBanner
            variant="default"
            title={t('infoBanner.title')}
            description={
              <p className="leading-relaxed">
                {t('infoBanner.description')}{' '}
                <TransitionLink href="/privacy" className="font-semibold text-gray-900 hover:underline">
                  {t('infoBanner.privacyPolicy')}
                </TransitionLink>
                .
              </p>
            }
            size="md"
            className="p-6 sm:p-8 rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
