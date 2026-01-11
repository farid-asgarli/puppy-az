'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { RegisterHeaderSection } from './sections/register-header.section';
import { PersonalInfoFormSection } from './sections/personal-info-form.section';
import { PhoneVerificationFormSection } from './sections/phone-verification-form.section';
import { RegisterFooterSection } from './sections/register-footer.section';
import { getSafeRedirectUrl } from '@/lib/auth/redirect-utils';
import { RegisterSideContent } from '@/lib/views/auth/register/sections/register-side-content.section';

export type RegisterStep = 'info' | 'verification';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  acceptTerms: boolean;
}

export default function RegisterView() {
  const searchParams = useSearchParams();
  const redirectUrl = getSafeRedirectUrl(searchParams.get('redirect'));

  const [step, setStep] = useState<RegisterStep>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const methods = useForm<RegisterFormData>({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      acceptTerms: false,
    },
  });

  const handleNextStep = () => {
    setStep('verification');
  };

  const handleBackStep = () => {
    setStep('info');
    setVerificationCode('');
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-white grid lg:grid-cols-2">
        {/* Left Side - Registration Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-16">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Header */}
            <RegisterHeaderSection currentStep={step} />

            {/* Form Steps */}
            <div className="space-y-6">
              {step === 'info' ? (
                <PersonalInfoFormSection isLoading={isLoading} setIsLoading={setIsLoading} onNext={handleNextStep} />
              ) : (
                <PhoneVerificationFormSection
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                  onBack={handleBackStep}
                  redirectUrl={redirectUrl}
                />
              )}
            </div>

            {/* Footer */}
            <RegisterFooterSection />
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-[60%] h-full lg:max-w-[80%]">
            <RegisterSideContent />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
