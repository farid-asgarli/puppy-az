'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import { LoginHeaderSection } from './sections/login-header.section';
import { EmailLoginFormSection } from './sections/email-login-form.section';
import { SmsLoginFormSection } from './sections/sms-login-form.section';
import { LoginFooterSection } from './sections/login-footer.section';
import { LoginSideContent } from './sections/login-side-content.section';
import { getSafeRedirectUrl } from '@/lib/auth/redirect-utils';

export type LoginMethod = 'email' | 'sms';

export default function LoginView() {
  const t = useTranslations('login');
  const searchParams = useSearchParams();
  const redirectUrl = getSafeRedirectUrl(searchParams.get('redirect'));

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12 lg:px-12 xl:px-16">
        <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <LoginHeaderSection />

          {/* Login Method Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setLoginMethod('email')}
              className={cn(
                'flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200',
                loginMethod === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {t('tabs.email')}
            </button>
            <button
              onClick={() => setLoginMethod('sms')}
              className={cn(
                'flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200',
                loginMethod === 'sms' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {t('tabs.sms')}
            </button>
          </div>

          {/* Login Forms */}
          <div className="space-y-5 sm:space-y-6">
            {loginMethod === 'email' ? (
              <EmailLoginFormSection isLoading={isLoading} setIsLoading={setIsLoading} redirectUrl={redirectUrl} />
            ) : (
              <SmsLoginFormSection isLoading={isLoading} setIsLoading={setIsLoading} redirectUrl={redirectUrl} />
            )}
          </div>

          {/* Footer */}
          <LoginFooterSection />
        </div>
      </div>

      {/* Right Side - Empty space with centered video content (Desktop Only) */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="w-full max-w-[60%] h-full lg:max-w-[80%]">
          <LoginSideContent />
        </div>
      </div>
    </div>
  );
}
