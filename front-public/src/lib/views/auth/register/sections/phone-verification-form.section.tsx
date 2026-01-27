"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/external/utils";
import OtpInput from "@/lib/components/otp-input/otp-input.component";
import { AuthAlert } from "@/lib/components/views/auth";
import { RegisterFormData } from "../register.view";
import { useState, useEffect } from "react";
import { registerAction, sendVerificationCodeAction } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface PhoneVerificationFormSectionProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onBack: () => void;
  redirectUrl: string;
}

export function PhoneVerificationFormSection({
  isLoading,
  setIsLoading,
  verificationCode,
  setVerificationCode,
  onBack,
  redirectUrl,
}: PhoneVerificationFormSectionProps) {
  const t = useTranslations("auth.register.verification");
  const router = useRouter();
  const { getValues } = useFormContext<RegisterFormData>();
  const [generalError, setGeneralError] = useState("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [otpError, setOtpError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const formData = getValues();

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
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
  }, [resendTimer]);

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setGeneralError("");
    setErrorDetails([]);
    setVerificationCode("");

    try {
      // Send phone number as-is (backend accepts both 501234567 and 0501234567)
      const result = await sendVerificationCodeAction({
        phoneNumber: formData.phoneNumber,
        purpose: "Registration",
      });

      if (result.success) {
        setResendTimer(60);
        setCanResend(false);
      } else {
        setGeneralError(result.error || t("codeNotSent"));
        setErrorDetails(result.details || []);
      }
    } catch {
      setGeneralError(t("generalError"));
      setErrorDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (code: string) => {
    if (code.length !== 6) {
      setOtpError("Tam kodu daxil edin");
      return;
    }

    setIsLoading(true);
    setGeneralError("");
    setErrorDetails([]);
    setOtpError("");

    try {
      // Send phone number as-is (backend accepts both 501234567 and 0501234567)
      const result = await registerAction({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        verificationCode: code,
      });

      if (result.success) {
        router.push(redirectUrl);
      } else {
        setGeneralError(result.error || t("registrationFailed"));
        setErrorDetails(result.details || []);
      }
    } catch {
      setGeneralError(t("generalError"));
      setErrorDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* General Error */}
      {generalError && (
        <AuthAlert
          variant="error"
          message={generalError}
          details={errorDetails}
        />
      )}

      {/* Success Message */}
      <AuthAlert
        variant="success"
        message={t("codeSent")}
        description={t("codeSentDescription", {
          phoneNumber: formData.phoneNumber,
        })}
      />

      {/* OTP Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          {t("verificationCode")}
        </label>
        <OtpInput
          length={6}
          error={otpError}
          isLoading={isLoading}
          isResending={false}
          resendCooldown={resendTimer}
          onComplete={(code) => {
            setVerificationCode(code);
            handleVerifyAndRegister(code);
          }}
          onResend={canResend ? handleResendCode : undefined}
          onErrorClear={() => setOtpError("")}
          autoSubmit={false}
          showVerifyButton={true}
        />
      </div>

      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isLoading}
        className={cn(
          "w-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors",
          isLoading && "opacity-50 cursor-not-allowed",
        )}
      >
        {t("editInfo")}
      </button>
    </div>
  );
}
