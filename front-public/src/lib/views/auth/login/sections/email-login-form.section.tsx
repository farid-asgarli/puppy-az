'use client';

import { useState } from 'react';
import { IconMail, IconLock } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import Button from '@/lib/primitives/button/button.component';
import TransitionLink from '@/lib/components/transition-link';
import { AuthFormField, AuthAlert } from '@/lib/components/views/auth';
import { loginWithEmailAction } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';

interface EmailLoginFormSectionProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  redirectUrl: string;
}

export function EmailLoginFormSection({ isLoading, setIsLoading, redirectUrl }: EmailLoginFormSectionProps) {
  const t = useTranslations('login.emailForm');
  const router = useRouter();
  const { refetch } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('validation.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('validation.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setErrorDetails([]);

    try {
      const result = await loginWithEmailAction({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Refetch auth state to update all components
        await refetch();
        // Redirect to original URL or home
        router.push(redirectUrl);
      } else {
        setErrors({ general: result.error || t('errors.loginFailed') });
        setErrorDetails(result.details || []);
      }
    } catch {
      setErrors({ general: t('errors.unknown') });
      setErrorDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {/* General Error Message */}
      {errors.general && <AuthAlert variant="error" message={errors.general} details={errorDetails} />}

      {/* Email Field */}
      <AuthFormField
        type="email"
        label={t('fields.email')}
        icon={IconMail}
        placeholder="email@example.com"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={errors.email}
        disabled={isLoading}
      />

      {/* Password Field */}
      <AuthFormField
        type="password"
        label={t('fields.password')}
        icon={IconLock}
        placeholder="••••••••"
        value={formData.password}
        onChange={handleInputChange('password')}
        error={errors.password}
        disabled={isLoading}
        showPasswordToggle
      />

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <TransitionLink href="/auth/forgot-password" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          {t('forgotPassword')}
        </TransitionLink>
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="accent" size="lg" className="w-full rounded-xl font-semibold text-sm sm:text-base" disabled={isLoading}>
        {isLoading ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
