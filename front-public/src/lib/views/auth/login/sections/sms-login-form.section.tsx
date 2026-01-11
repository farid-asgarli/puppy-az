'use client';

import { useState, useEffect } from 'react';
import { IconPhone, IconAlertCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import Button from '@/lib/primitives/button/button.component';
import OtpInput from '@/lib/components/otp-input/otp-input.component';
import { AuthAlert } from '@/lib/components/views/auth';
import { loginWithMobileAction, sendVerificationCodeAction } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';

interface SmsLoginFormSectionProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  redirectUrl: string;
}

type Step = 'phone' | 'otp';

export function SmsLoginFormSection({ isLoading, setIsLoading, redirectUrl }: SmsLoginFormSectionProps) {
  const t = useTranslations('login.smsForm');
  const router = useRouter();
  const { refetch } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<{
    phone?: string;
    otp?: string;
    general?: string;
  }>({});
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  // Resend timer
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Timer countdown
  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, resendTimer]);

  const validatePhone = (): boolean => {
    const newErrors: typeof errors = {};

    if (!phoneNumber) {
      newErrors.phone = t('validation.phoneRequired');
    } else if (!/^[0-9]{9}$/.test(phoneNumber)) {
      newErrors.phone = t('validation.phoneInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validatePhone()) return;

    setIsLoading(true);
    setErrors({});
    setErrorDetails([]);

    try {
      const fullPhoneNumber = `0${phoneNumber}`;
      const result = await sendVerificationCodeAction({ phoneNumber: fullPhoneNumber, purpose: 'Login' });

      if (result.success) {
        setStep('otp');
        setResendTimer(60);
        setCanResend(false);
      } else {
        setErrors({ general: result.error || t('errors.sendFailed') });
        setErrorDetails(result.details || []);
      }
    } catch {
      setErrors({ general: t('errors.unknown') });
      setErrorDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    setOtp('');
    handleSendCode();
  };

  const handleVerifyCode = async (code?: string) => {
    const codeToVerify = code || otp;

    if (codeToVerify.length !== 6) {
      setErrors({ otp: t('validation.otpInvalid') });
      return;
    }

    setIsLoading(true);
    setErrors({});
    setErrorDetails([]);

    try {
      const fullPhoneNumber = `0${phoneNumber}`;
      const result = await loginWithMobileAction({
        phoneNumber: fullPhoneNumber,
        verificationCode: codeToVerify,
      });

      if (result.success) {
        // Refetch auth state to update all components
        await refetch();
        router.push(redirectUrl);
      } else {
        setErrors({ general: result.error || t('errors.verifyFailed') });
        setErrorDetails(result.details || []);
      }
    } catch {
      setErrors({ general: t('errors.unknown') });
      setErrorDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(value);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setErrors({});
    setErrorDetails([]);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* General Error Message */}
      {errors.general && <AuthAlert variant="error" message={errors.general} details={errorDetails} />}

      {step === 'phone' ? (
        /* Phone Number Step */
        <form onSubmit={handleSendCode} className="space-y-4 sm:space-y-5">
          {/* Phone Number Field */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-900">
              {t('phoneStep.label')}
            </label>
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2 text-gray-600 border-r border-gray-200 pr-2 sm:pr-3">
                <IconPhone size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">{t('phoneStep.prefix')}</span>
              </div>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                disabled={isLoading}
                placeholder={t('phoneStep.placeholder')}
                className={cn(
                  'w-full pl-20 sm:pl-24 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base',
                  'text-gray-900 placeholder:text-gray-400',
                  'focus:outline-none focus:ring-0',
                  errors.phone ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 bg-white focus:border-gray-900',
                  isLoading && 'opacity-50 cursor-not-allowed'
                )}
              />
            </div>
            {errors.phone && (
              <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                <IconAlertCircle size={14} className="sm:w-4 sm:h-4" />
                {errors.phone}
              </p>
            )}
            <p className="text-xs text-gray-500">{t('phoneStep.hint')}</p>
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="accent" size="lg" className="w-full rounded-xl font-semibold text-sm sm:text-base" disabled={isLoading}>
            {isLoading ? t('phoneStep.submitting', { defaultValue: 'Sending...' }) : t('phoneStep.submit')}
          </Button>
        </form>
      ) : (
        /* OTP Verification Step */
        <div className="space-y-4 sm:space-y-5">
          {/* Success Message */}
          <AuthAlert variant="success" message={t('success.codeSent')} description={`${t('otpStep.subtitle')} +994 ${phoneNumber}`} />

          {/* OTP Input */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-900">{t('otpStep.title')}</label>
            <OtpInput
              length={6}
              error={errors.otp}
              isLoading={isLoading}
              isResending={false}
              resendCooldown={resendTimer}
              onComplete={(code) => {
                setOtp(code);
                handleVerifyCode(code);
              }}
              onResend={canResend ? handleResendCode : undefined}
              onErrorClear={() => setErrors((prev) => ({ ...prev, otp: undefined }))}
              autoSubmit={false}
              showVerifyButton={true}
            />
          </div>

          {/* Back to Phone */}
          <button
            type="button"
            onClick={handleBackToPhone}
            disabled={isLoading}
            className="w-full text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            ← {t('otpStep.changeNumber')}
          </button>
        </div>
      )}
    </div>
  );
}
