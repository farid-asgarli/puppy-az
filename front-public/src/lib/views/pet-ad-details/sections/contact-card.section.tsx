"use client";

import { useState, useEffect } from "react";
import { PetOwnerDto } from "@/lib/api/types/pet-ad.types";
import { cn } from "@/lib/external/utils";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconMessageCircle,
  IconClock,
  IconX,
  IconSend,
} from "@tabler/icons-react";
import { formatMonthYear } from "@/lib/utils/date-utils";
import Button from "@/lib/primitives/button/button.component";
import { useTranslations } from "next-intl";
import { formatPhoneForDisplay } from "@/lib/utils/phone-utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";
import { sendMessageAction } from "@/lib/auth/actions";

export interface AdDetailsContactCardSectionProps {
  owner: PetOwnerDto;
  contactPhone: string;
  contactEmail: string;
  price: number;
  isMobile?: boolean;
  petAdId: number;
  petAdTitle: string;
}

export function AdDetailsContactCardSection({
  owner,
  contactPhone,
  contactEmail,
  price,
  isMobile = false,
  petAdId,
  petAdTitle,
}: AdDetailsContactCardSectionProps) {
  const t = useTranslations("petAdDetails.contactCard");
  const tDate = useTranslations("dateTime");
  const memberSince = formatMonthYear(owner.memberSince, tDate);
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Block body scroll when modal is open
  useEffect(() => {
    if (isMessageModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMessageModalOpen]);

  const handleCall = () => {
    window.location.href = `tel:${contactPhone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contactEmail}`;
  };

  const handleMessage = () => {
    if (loading) return;

    if (!isAuthenticated) {
      // Redirect to auth page with return URL
      const currentPath = window.location.pathname;
      router.push(`/auth?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check if user is trying to message themselves
    if (user?.id === owner.id) {
      toast.error(t("cannotMessageSelf"));
      return;
    }

    // Open message modal
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error(t("messageRequired"));
      return;
    }

    setIsSending(true);
    try {
      const result = await sendMessageAction({
        receiverId: owner.id,
        petAdId: petAdId,
        content: messageText.trim(),
      });

      if (result.success) {
        toast.success(t("messageSent"));
        setMessageText("");
        setIsMessageModalOpen(false);
      } else {
        toast.error(result.error || t("messageFailed"));
      }
    } catch (error) {
      toast.error(t("messageFailed"));
    } finally {
      setIsSending(false);
    }
  };

  // Message Modal JSX - rendered inline to avoid focus issues
  const messageModalJsx = isMessageModalOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setIsMessageModalOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("sendMessageTo", { name: owner.fullName })}
          </h3>
          <button
            onClick={() => setIsMessageModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IconX size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Ad Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">{t("regardingAd")}</p>
          <p className="font-medium text-gray-900 truncate">{petAdTitle}</p>
        </div>

        {/* Message Input */}
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className="w-full h-32 p-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-purple-500 transition-colors"
          maxLength={1000}
          autoFocus
        />
        <div className="flex justify-end mt-1 mb-4">
          <span className="text-xs text-gray-400">
            {messageText.length}/1000
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 rounded-xl"
            onClick={() => setIsMessageModalOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="accent"
            className="flex-1 rounded-xl"
            onClick={handleSendMessage}
            disabled={isSending || !messageText.trim()}
            leftSection={<IconSend size={18} />}
          >
            {isSending ? t("sending") : t("send")}
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  // Desktop version (sidebar card)
  if (!isMobile) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Price Card */}
        <div className="p-4 sm:p-6 rounded-xl border-2 border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            {t("price")}
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
            {price === 0 ? t("free") : `${price.toLocaleString()} ₼`}
          </div>
        </div>

        {/* Owner Contact Card */}
        <div className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 space-y-4 sm:space-y-6">
          {/* Owner Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {t("contact")}
            </h3>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {owner.profilePictureUrl ? (
                  <img
                    src={owner.profilePictureUrl}
                    alt={owner.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IconUser size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                )}
              </div>

              {/* Owner Details */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                  {owner.fullName}
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                  <IconClock size={12} className="sm:w-[14px] sm:h-[14px]" />
                  <span>{t("memberSince", { date: memberSince })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <Button
              variant="accent"
              size="lg"
              className="w-full rounded-xl font-semibold text-sm sm:text-base"
              leftSection={
                <IconPhone size={16} className="sm:w-[18px] sm:h-[18px]" />
              }
              onClick={handleCall}
            >
              {t("call")}
            </Button>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="secondary"
                size="md"
                className="rounded-xl font-medium text-xs sm:text-sm"
                leftSection={
                  <IconMessageCircle
                    size={16}
                    className="sm:w-[18px] sm:h-[18px]"
                  />
                }
                onClick={handleMessage}
              >
                {t("sendMessage")}
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="rounded-xl font-medium text-xs sm:text-sm"
                leftSection={
                  <IconMail size={16} className="sm:w-[18px] sm:h-[18px]" />
                }
                onClick={handleEmail}
              >
                {t("email")}
              </Button>
            </div>
          </div>

          {/* Contact Info Display */}
          <div className="pt-3 sm:pt-4 border-t-2 border-gray-200 space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <IconPhone
                size={14}
                className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
              />
              <span className="text-gray-700 truncate">
                {formatPhoneForDisplay(contactPhone)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <IconMail
                size={14}
                className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
              />
              <span className="text-gray-700 truncate">{contactEmail}</span>
            </div>
          </div>
        </div>
        {messageModalJsx}
      </div>
    );
  }

  // Mobile version (sticky bottom bar)
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 sm:p-6 z-20">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-semibold text-gray-900">
              {price === 0 ? t("free") : `${price.toLocaleString()} ₼`}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">{t("price")}</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleMessage}
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-gray-200",
                "hover:border-gray-400 flex items-center justify-center",
                "transition-all duration-200",
              )}
              aria-label={t("sendMessageAriaLabel")}
            >
              <IconMessageCircle size={18} className="sm:w-5 sm:h-5" />
            </button>
            <Button
              variant="accent"
              className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base"
              leftSection={
                <IconPhone size={16} className="sm:w-[18px] sm:h-[18px]" />
              }
              onClick={handleCall}
            >
              {t("call")}
            </Button>
          </div>
        </div>
      </div>
      {messageModalJsx}
    </>
  );
}
