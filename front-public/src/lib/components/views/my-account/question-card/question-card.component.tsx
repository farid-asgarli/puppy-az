"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  IconMessageCircle,
  IconSend,
  IconExternalLink,
  IconClock,
  IconCheck,
  IconUser,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { MyAdQuestionDto } from "@/lib/api/types/pet-ad.types";

import { formatDate } from "@/lib/utils/date-utils";
import TransitionLink from "@/lib/components/transition-link";

interface QuestionCardProps {
  question: MyAdQuestionDto;
  onAnswerSubmit: (questionId: number, answer: string) => Promise<void>;
}

/**
 * QuestionCard - Display individual question with answer functionality
 *
 * Features:
 * - Shows question details and asker info
 * - Displays pet ad thumbnail and title
 * - Inline answer textarea for unanswered questions
 * - Shows existing answer for answered questions
 * - Links to the specific pet ad
 */
export function QuestionCard({ question, onAnswerSubmit }: QuestionCardProps) {
  const t = useTranslations("myAccount.questions.card");
  const tDate = useTranslations("dateTime");

  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAnswerSubmit(question.questionId, answer.trim());
      setAnswer(""); // Clear input on success
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300">
      {/* Pet Ad Info Header */}
      <div className="flex items-start gap-4 p-5 pb-4 border-b border-gray-100">
        {/* Ad Thumbnail */}
        <TransitionLink
          href={`/ads/item-details/${question.petAdId}`}
          className="shrink-0"
        >
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity">
            <img
              src={question.primaryImageUrl || ""}
              alt={question.petAdTitle}
              className="w-full h-full object-cover"
            />
          </div>
        </TransitionLink>

        {/* Ad Details */}
        <div className="flex-1 min-w-0">
          <TransitionLink href={`/ads/item-details/${question.petAdId}`}>
            <h3 className="font-semibold text-gray-900 text-base truncate hover:text-blue-600 transition-colors">
              {question.petAdTitle}
            </h3>
          </TransitionLink>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <IconMessageCircle size={16} className="shrink-0" />
            <span className="truncate">
              {t("askedBy", { name: question.questionerName })}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0",
            question.isAnswered
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-amber-50 text-amber-700 border border-amber-200",
          )}
        >
          {question.isAnswered ? (
            <>
              <IconCheck size={14} strokeWidth={2.5} />
              <span>{t("answered", { defaultValue: "Answered" })}</span>
            </>
          ) : (
            <>
              <IconClock size={14} strokeWidth={2.5} />
              <span>{t("noAnswer")}</span>
            </>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="p-5 space-y-4">
        {/* Question */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t("question")}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              {formatDate(question.askedAt, tDate)}
            </span>
          </div>
          <p className="text-gray-900 leading-relaxed">{question.question}</p>
        </div>

        {/* Answer Section */}
        {question.isAnswered && question.answer ? (
          // Show existing answer
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                {t("yourAnswer")}
              </span>
              {question.answeredAt && (
                <>
                  <span className="text-xs text-blue-400">•</span>
                  <span className="text-xs text-blue-600">
                    {formatDate(question.answeredAt, tDate)}
                  </span>
                </>
              )}
            </div>
            <p className="text-gray-900 leading-relaxed">{question.answer}</p>
          </div>
        ) : (
          // Show answer input
          <div className="space-y-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t("answerPlaceholder")}
              rows={3}
              maxLength={1000}
              disabled={isSubmitting}
              className={cn(
                "w-full px-4 py-3 rounded-xl border resize-none transition-all duration-200",
                "text-gray-900 placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                isSubmitting
                  ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                  : "bg-white border-gray-300 hover:border-gray-400",
              )}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {answer.length}/1000
              </span>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!answer.trim() || isSubmitting}
                className={cn(
                  "inline-flex items-center gap-2 px-4 h-10 text-sm font-medium rounded-xl transition-all duration-200",
                  !answer.trim() || isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700",
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <IconSend size={16} />
                    <span>{t("sendAnswer")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Replies Section */}
        {question.replies && question.replies.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <IconMessageCircle size={16} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t("replies", { defaultValue: "Replies" })} (
                {question.replies.length})
              </span>
            </div>

            <div className="space-y-3">
              {question.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2.5">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      reply.isOwnerReply ? "bg-emerald-100" : "bg-gray-100",
                    )}
                  >
                    {reply.isOwnerReply ? (
                      <IconCheck size={16} className="text-emerald-600" />
                    ) : (
                      <IconUser size={16} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "inline-block rounded-2xl px-3 py-2",
                        reply.isOwnerReply ? "bg-emerald-50" : "bg-gray-100",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-semibold text-[13px]",
                            reply.isOwnerReply
                              ? "text-emerald-700"
                              : "text-gray-900",
                          )}
                        >
                          {reply.userName}
                        </span>
                        {reply.isOwnerReply && (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                            {t("owner", { defaultValue: "Owner" })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 mt-0.5">
                        {reply.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 ml-3">
                      <span
                        className="text-[11px] text-gray-400"
                        suppressHydrationWarning
                      >
                        {formatDate(reply.createdAt, tDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - View Ad Link */}
      <div className="px-5 pb-5">
        <TransitionLink
          href={`/ads/item-details/${question.petAdId}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          <IconExternalLink size={16} />
          <span>{t("viewAd")}</span>
        </TransitionLink>
      </div>
    </div>
  );
}
