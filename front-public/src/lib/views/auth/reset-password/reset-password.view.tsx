'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from '@/i18n';
import { IconLock, IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import Button from '@/lib/primitives/button/button.component';
import TransitionLink from '@/lib/components/transition-link';
import { AuthFormField, AuthAlert } from '@/lib/components/views/auth';
import { resetPasswordAction, verifyResetTokenAction } from '@/lib/auth/actions';
import { AppLogo } from '@/lib/components/logo/logo';
import Spinner from '@/lib/primitives/spinner/spinner.component';

function ResetPasswordContent() {
  const t = useTranslations('resetPassword');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyResetTokenAction({ token });
        setIsValidToken(result.success);
      } catch {
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const validateForm = (): boolean => {
    if (!formData.password) {
      setError(t('validation.passwordRequired'));
      return false;
    }
    if (formData.password.length < 8) {
      setError(t('validation.passwordMinLength'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('validation.passwordMismatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    if (!token) return;

    setIsLoading(true);

    try {
      const result = await resetPasswordAction({
        token,
        newPassword: formData.password,
      });

      if (result.success) {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      } else {
        setError(result.error || t('errors.resetFailed'));
      }
    } catch {
      setError(t('errors.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center px-4'>
        <div className='text-center space-y-4'>
          <Spinner size='lg' />
          <p className='text-gray-600'>{t('verifying')}</p>
        </div>
      </div>
    );
  }

  // Invalid or missing token
  if (!token || !isValidToken) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center px-4'>
        <div className='w-full max-w-md space-y-8 text-center'>
          <div className='flex justify-center'>
            <AppLogo showTagline={false} />
          </div>

          <div className='flex justify-center'>
            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center'>
              <IconX size={40} className='text-red-600' />
            </div>
          </div>

          <div className='space-y-3'>
            <h1 className='text-2xl font-bold text-gray-900'>{t('invalid.title')}</h1>
            <p className='text-gray-600'>{t('invalid.description')}</p>
          </div>

          <div className='space-y-4'>
            <TransitionLink href='/auth/forgot-password'>
              <Button variant='accent' size='lg' className='w-full rounded-xl'>
                {t('invalid.requestNew')}
              </Button>
            </TransitionLink>

            <TransitionLink href='/auth' className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'>
              <IconArrowLeft size={18} />
              {t('backToLogin')}
            </TransitionLink>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center px-4'>
        <div className='w-full max-w-md space-y-8 text-center'>
          <div className='flex justify-center'>
            <AppLogo showTagline={false} />
          </div>

          <div className='flex justify-center'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
              <IconCheck size={40} className='text-green-600' />
            </div>
          </div>

          <div className='space-y-3'>
            <h1 className='text-2xl font-bold text-gray-900'>{t('success.title')}</h1>
            <p className='text-gray-600'>{t('success.description')}</p>
          </div>

          <p className='text-sm text-gray-500'>{t('success.redirecting')}</p>

          <TransitionLink href='/auth' className='inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors'>
            <IconArrowLeft size={18} />
            {t('backToLogin')}
          </TransitionLink>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex justify-center'>
          <AppLogo showTagline={false} />
        </div>

        <div className='text-center space-y-2'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>{t('title')}</h1>
          <p className='text-gray-600'>{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {error && <AuthAlert variant='error' message={error} />}

          <AuthFormField
            type='password'
            label={t('fields.password')}
            icon={IconLock}
            placeholder='••••••••'
            value={formData.password}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }));
              if (error) setError(null);
            }}
            error={undefined}
            disabled={isLoading}
            showPasswordToggle
          />

          <AuthFormField
            type='password'
            label={t('fields.confirmPassword')}
            icon={IconLock}
            placeholder='••••••••'
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }));
              if (error) setError(null);
            }}
            error={undefined}
            disabled={isLoading}
            showPasswordToggle
          />

          <div className='text-sm text-gray-500'>
            <p>{t('passwordRequirements')}</p>
          </div>

          <Button type='submit' variant='accent' size='lg' className='w-full rounded-xl font-semibold' disabled={isLoading}>
            {isLoading ? t('submitting') : t('submit')}
          </Button>
        </form>

        <div className='text-center'>
          <TransitionLink href='/auth' className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'>
            <IconArrowLeft size={18} />
            {t('backToLogin')}
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordView() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-white flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
