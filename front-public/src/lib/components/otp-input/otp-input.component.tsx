'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconRefresh, IconCheck, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import Button from '@/lib/primitives/button/button.component';
import { Alert } from '@/lib/primitives/alert';
import { Spinner } from '@/lib/primitives/spinner';
import { useTranslations } from 'next-intl';

export interface OtpInputProps {
  /** Number of OTP digits (default: 6) */
  length?: number;
  /** Error message to display */
  error?: string;
  /** Success message to display */
  successMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Is resending code */
  isResending?: boolean;
  /** Resend cooldown in seconds */
  resendCooldown?: number;
  /** Callback when OTP is complete */
  onComplete: (otp: string) => void;
  /** Callback when resend is clicked */
  onResend?: () => void;
  /** Callback to clear error */
  onErrorClear?: () => void;
  /** Show verify button even when incomplete (default: false) */
  showVerifyButton?: boolean;
  /** Auto-submit when OTP is complete (default: true) */
  autoSubmit?: boolean;
}

/**
 * Reusable OTP Input Component
 *
 * Handles OTP input logic, validation, paste support, and resend functionality.
 * Used across login and registration OTP verification flows.
 *
 * @example
 * <OtpInput
 *   error={error}
 *   isLoading={isLoading}
 *   onComplete={handleVerifyOtp}
 *   onResend={handleResend}
 * />
 */
export default function OtpInput({
  length = 6,
  error,
  successMessage,
  isLoading = false,
  isResending = false,
  resendCooldown = 0,
  onComplete,
  onResend,
  onErrorClear,
  showVerifyButton = false,
  autoSubmit = true,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [shakeError, setShakeError] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const t = useTranslations('auth');

  // Clear error when user starts typing
  useEffect(() => {
    if (error && otp.some((digit) => digit !== '') && onErrorClear) {
      onErrorClear();
    }
  }, [otp, error, onErrorClear]);

  // Trigger shake animation on error
  useEffect(() => {
    if (error) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);

      // Clear OTP and focus first input
      setOtp(Array(length).fill(''));
      otpRefs.current[0]?.focus();
    }
  }, [error, length]);

  const handleOtpChange = (index: number, value: string) => {
    // Handle paste
    if (value.length > 1) {
      const pastedCode = value.replace(/\D/g, '').slice(0, length);
      const newOtp = [...otp];

      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedCode[i] || '';
      }

      setOtp(newOtp);

      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      otpRefs.current[focusIndex]?.focus();

      // Auto-verify if complete
      if (pastedCode.length === length && autoSubmit) {
        setTimeout(() => onComplete(pastedCode), 100);
      }
      return;
    }

    // Handle single digit input
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < length - 1) {
        otpRefs.current[index + 1]?.focus();
      }

      // Auto-verify when complete
      const isComplete = newOtp.every((digit) => digit !== '');
      if (isComplete && autoSubmit) {
        setTimeout(() => onComplete(newOtp.join('')), 200);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <div className="space-y-6">
      {/* OTP Inputs */}
      <motion.div animate={shakeError ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.5 }}>
        <div className="flex justify-center gap-1.5 sm:gap-3 mb-6">
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <input
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                id={`otp-${index}`}
                className={cn(
                  'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-base sm:text-lg md:text-xl font-bold border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none',
                  error
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : digit
                    ? 'border-primary-400 bg-primary-50 text-primary-900'
                    : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-primary-400 focus:bg-primary-50/50'
                )}
                maxLength={1}
                disabled={isLoading}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Messages */}
      <div className="min-h-[60px] space-y-3">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Alert variant="error" size="sm" icon={IconX} description={error} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Alert variant="success" size="sm" icon={IconCheck} description={successMessage} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resend Section */}
        {!error && !successMessage && onResend && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center space-y-3">
            <p className="text-xs sm:text-sm text-gray-600">{t('enterCode')}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onResend}
              disabled={resendCooldown > 0 || isResending}
              leftSection={
                isResending ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <IconRefresh size={16} />
                  </motion.div>
                ) : (
                  <IconRefresh size={16} />
                )
              }
              className="border-2 rounded-xl font-medium text-xs sm:text-sm"
            >
              {resendCooldown > 0 ? t('otp.resendIn', { seconds: resendCooldown }) : isResending ? t('otp.resending') : t('resendCode')}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Verify Button (optional) */}
      {showVerifyButton && (
        <Button
          type="button"
          onClick={() => onComplete(otp.join(''))}
          disabled={isLoading || !isComplete}
          variant="accent"
          fullWidth
          size="lg"
          className="h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Spinner size="sm" color="white" />
              <span>{t('otp.verifying')}</span>
            </div>
          ) : (
            t('otp.verify')
          )}
        </Button>
      )}
    </div>
  );
}
