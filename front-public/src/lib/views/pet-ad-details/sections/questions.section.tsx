"use client";

import React, { useState, useRef, useEffect } from "react";
import { PetAdQuestionDto } from "@/lib/api/types/pet-ad.types";
import { cn } from "@/lib/external/utils";
import {
  IconUser,
  IconSend,
  IconCheck,
  IconTrash,
  IconEdit,
  IconX,
} from "@tabler/icons-react";
import ConfirmationDialog from "@/lib/components/confirmation-dialog/confirmation-dialog.component";
import { formatDate } from "@/lib/utils/date-utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { ExpandableSection } from "@/lib/components/views/pet-ad-details/expandable-section";
import { SectionHeader } from "@/lib/components/views/common";
import {
  askQuestionAction,
  replyToQuestionAction,
  deleteQuestionAction,
  deleteReplyAction,
  deleteAnswerAction,
  updateQuestionAction,
  updateAnswerAction,
  updateReplyAction,
} from "@/lib/auth/actions";
import { useRouter } from "@/i18n";
import { useTranslations } from "next-intl";

export interface AdDetailsQuestionsSectionProps {
  questions: PetAdQuestionDto[];
  adId: number;
  ownerId: string;
}

export function AdDetailsQuestionsSection({
  questions,
  adId,
  ownerId,
}: AdDetailsQuestionsSectionProps) {
  const t = useTranslations("petAdDetails.questions");
  const tDate = useTranslations("dateTime");
  const [questionText, setQuestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_isInputFocused, setIsInputFocused] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const questionInputRef = useRef<HTMLInputElement>(null);

  // Track which question is being replied to
  const [replyingToQuestionId, setReplyingToQuestionId] = useState<
    number | null
  >(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const replyInputRef = useRef<HTMLInputElement>(null);

  // Track delete operations
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(
    null,
  );
  const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);

  // Confirmation dialog state
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState<
    number | null
  >(null);
  const [confirmDeleteReply, setConfirmDeleteReply] = useState<number | null>(
    null,
  );
  const [confirmDeleteAnswer, setConfirmDeleteAnswer] = useState<number | null>(
    null,
  );

  // Delete answer loading state
  const [deletingAnswerId, setDeletingAnswerId] = useState<number | null>(null);

  // Edit states
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null,
  );
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswerText, setEditAnswerText] = useState("");
  const [editReplyText, setEditReplyText] = useState("");
  const [isUpdatingQuestion, setIsUpdatingQuestion] = useState(false);
  const [isUpdatingAnswer, setIsUpdatingAnswer] = useState(false);
  const [isUpdatingReply, setIsUpdatingReply] = useState(false);

  // Check if current user is the ad owner
  const isOwner = user?.id === ownerId;

  // Show all questions to everyone (questions are public)
  const displayQuestions = questions;

  // Focus reply input when replying
  useEffect(() => {
    if (replyingToQuestionId !== null && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingToQuestionId]);

  // Handle question deletion - show confirmation
  const handleDeleteQuestionClick = (questionId: number) => {
    setConfirmDeleteQuestion(questionId);
  };

  // Confirm question deletion
  const handleConfirmDeleteQuestion = async () => {
    if (!confirmDeleteQuestion || deletingQuestionId) return;

    const questionId = confirmDeleteQuestion;
    setConfirmDeleteQuestion(null);
    setDeletingQuestionId(questionId);

    try {
      const result = await deleteQuestionAction(questionId);

      if (!result.success) {
        setDeletingQuestionId(null);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete question:", error);
    } finally {
      setDeletingQuestionId(null);
    }
  };

  // Handle reply deletion - show confirmation
  const handleDeleteReplyClick = (replyId: number) => {
    setConfirmDeleteReply(replyId);
  };

  // Confirm reply deletion
  const handleConfirmDeleteReply = async () => {
    if (!confirmDeleteReply || deletingReplyId) return;

    const replyId = confirmDeleteReply;
    setConfirmDeleteReply(null);
    setDeletingReplyId(replyId);

    try {
      const result = await deleteReplyAction(replyId);

      if (!result.success) {
        setDeletingReplyId(null);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete reply:", error);
    } finally {
      setDeletingReplyId(null);
    }
  };

  // Check if user can delete a question (question author or ad owner)
  const canDeleteQuestion = (questionUserId: string) => {
    if (!user) return false;
    return user.id === questionUserId || isOwner;
  };

  // Check if user can delete a reply (reply author or ad owner)
  const canDeleteReply = (replyUserId: string) => {
    if (!user) return false;
    return user.id === replyUserId || isOwner;
  };

  // Check if user can edit a question (only question author)
  const canEditQuestion = (questionUserId: string) => {
    if (!user) return false;
    return user.id === questionUserId;
  };

  // Check if user can edit a reply (only reply author)
  const canEditReply = (replyUserId: string) => {
    if (!user) return false;
    return user.id === replyUserId;
  };

  // Handle edit question
  const handleEditQuestionClick = (questionId: number, currentText: string) => {
    setEditingQuestionId(questionId);
    setEditQuestionText(currentText);
  };

  // Handle update question
  const handleUpdateQuestion = async (questionId: number) => {
    if (!editQuestionText.trim() || isUpdatingQuestion) return;

    setIsUpdatingQuestion(true);

    try {
      const result = await updateQuestionAction(
        questionId,
        editQuestionText.trim(),
      );

      if (!result.success) {
        setIsUpdatingQuestion(false);
        return;
      }

      setEditingQuestionId(null);
      setEditQuestionText("");
      router.refresh();
    } catch (error) {
      console.error("Failed to update question:", error);
    } finally {
      setIsUpdatingQuestion(false);
    }
  };

  // Handle edit answer
  const handleEditAnswerClick = (questionId: number, currentText: string) => {
    setEditingAnswerId(questionId);
    setEditAnswerText(currentText);
  };

  // Handle update answer
  const handleUpdateAnswer = async (questionId: number) => {
    if (!editAnswerText.trim() || isUpdatingAnswer) return;

    setIsUpdatingAnswer(true);

    try {
      const result = await updateAnswerAction(
        questionId,
        editAnswerText.trim(),
      );

      if (!result.success) {
        setIsUpdatingAnswer(false);
        return;
      }

      setEditingAnswerId(null);
      setEditAnswerText("");
      router.refresh();
    } catch (error) {
      console.error("Failed to update answer:", error);
    } finally {
      setIsUpdatingAnswer(false);
    }
  };

  // Handle edit reply
  const handleEditReplyClick = (replyId: number, currentText: string) => {
    setEditingReplyId(replyId);
    setEditReplyText(currentText);
  };

  // Handle update reply
  const handleUpdateReply = async (replyId: number) => {
    if (!editReplyText.trim() || isUpdatingReply) return;

    setIsUpdatingReply(true);

    try {
      const result = await updateReplyAction(replyId, editReplyText.trim());

      if (!result.success) {
        setIsUpdatingReply(false);
        return;
      }

      setEditingReplyId(null);
      setEditReplyText("");
      router.refresh();
    } catch (error) {
      console.error("Failed to update reply:", error);
    } finally {
      setIsUpdatingReply(false);
    }
  };

  // Handle answer deletion - show confirmation (only ad owner can delete answer)
  const handleDeleteAnswerClick = (questionId: number) => {
    setConfirmDeleteAnswer(questionId);
  };

  // Confirm answer deletion
  const handleConfirmDeleteAnswer = async () => {
    if (!confirmDeleteAnswer || deletingAnswerId) return;

    const questionId = confirmDeleteAnswer;
    setConfirmDeleteAnswer(null);
    setDeletingAnswerId(questionId);

    try {
      const result = await deleteAnswerAction(questionId);

      if (!result.success) {
        setDeletingAnswerId(null);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete answer:", error);
    } finally {
      setDeletingAnswerId(null);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (questionId: number) => {
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);

    try {
      const result = await replyToQuestionAction(questionId, replyText.trim());

      if (!result.success) {
        setIsSubmittingReply(false);
        return;
      }

      // Clear the reply input
      setReplyingToQuestionId(null);
      setReplyText("");

      // Reload the page to show the new reply using GET
      window.location.reload();
    } catch (error) {
      console.error("Failed to submit reply:", error);
      setIsSubmittingReply(false);
    }
  };

  // Handle question input focus
  const handleQuestionFocus = () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/auth?redirect=/ads/item-details/${adId}`;
      return;
    }
    setIsInputFocused(true);
  };

  // Handle question submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await askQuestionAction(adId, questionText.trim());

      if (!result.success) {
        setIsSubmitting(false);
        return;
      }

      setQuestionText("");
      setIsInputFocused(false);

      // Refresh the page to show the new question
      router.refresh();
    } catch (error) {
      console.error("Failed to submit question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <SectionHeader title={t("title")} layout="horizontal" />

      {/* Ask Question - Simple input like the image */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <IconUser size={20} className="text-gray-400" />
          </div>
          <div className="flex-1 relative">
            <input
              ref={questionInputRef}
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              onFocus={handleQuestionFocus}
              onBlur={() => !questionText && setIsInputFocused(false)}
              placeholder={t("modal.placeholder")}
              className="w-full h-10 pl-4 pr-10 bg-gray-100 rounded-full border-0 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={isSubmitting || !questionText.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors"
            >
              <IconSend
                size={18}
                className={isSubmitting ? "animate-pulse" : ""}
              />
            </button>
          </div>
        </div>
      </form>

      {/* Questions */}
      {displayQuestions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">{t("noQuestions")}</p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-gray-100">
          <ExpandableSection
            type="items"
            threshold={3}
            expandLabel={t("showAll", { count: displayQuestions.length })}
            collapseLabel={t("showLess")}
            className="divide-y divide-gray-100"
            buttonClassName="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors py-3"
            renderCollapsed={(children) => {
              if (Array.isArray(children)) {
                return children.slice(0, 3);
              }
              return children;
            }}
          >
            {displayQuestions.map((question) => (
              <div key={question.id} className="py-4">
                {/* Question with avatar */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <IconUser size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">
                        {question.questionerName}
                      </span>
                      <span
                        className="text-xs text-gray-400"
                        suppressHydrationWarning
                      >
                        {formatDate(question.askedAt, tDate)}
                      </span>
                      {canEditQuestion(question.userId) &&
                        editingQuestionId !== question.id && (
                          <button
                            type="button"
                            onClick={() =>
                              handleEditQuestionClick(
                                question.id,
                                question.question,
                              )
                            }
                            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            title={t("edit")}
                          >
                            <IconEdit size={16} />
                          </button>
                        )}
                      {canDeleteQuestion(question.userId) &&
                        editingQuestionId !== question.id && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteQuestionClick(question.id)
                            }
                            disabled={deletingQuestionId === question.id}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                            title={t("delete")}
                          >
                            <IconTrash
                              size={16}
                              className={
                                deletingQuestionId === question.id
                                  ? "animate-pulse"
                                  : ""
                              }
                            />
                          </button>
                        )}
                    </div>
                    {/* Question text or edit input */}
                    {editingQuestionId === question.id ? (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={editQuestionText}
                          onChange={(e) => setEditQuestionText(e.target.value)}
                          className="flex-1 h-9 px-3 bg-gray-100 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-gray-900"
                          maxLength={1000}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && editQuestionText.trim()) {
                              e.preventDefault();
                              handleUpdateQuestion(question.id);
                            }
                            if (e.key === "Escape") {
                              setEditingQuestionId(null);
                              setEditQuestionText("");
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateQuestion(question.id)}
                          disabled={
                            isUpdatingQuestion || !editQuestionText.trim()
                          }
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <IconCheck
                            size={18}
                            className={
                              isUpdatingQuestion ? "animate-pulse" : ""
                            }
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingQuestionId(null);
                            setEditQuestionText("");
                          }}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[15px] text-gray-800 mt-0.5 leading-relaxed">
                        {question.question}
                      </p>
                    )}

                    {/* Owner Answer - shown first if exists */}
                    {question.answer && (
                      <div className="mt-3 space-y-3">
                        <div className="flex gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <IconCheck size={16} className="text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="inline-block rounded-2xl px-3 py-2 bg-emerald-50">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-[13px] text-emerald-700">
                                    {t("owner")}
                                  </span>
                                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                    {t("owner")}
                                  </span>
                                  {question.answeredAt && (
                                    <span
                                      className="text-[11px] text-gray-400"
                                      suppressHydrationWarning
                                    >
                                      {formatDate(question.answeredAt, tDate)}
                                    </span>
                                  )}
                                </div>
                                {isOwner && editingAnswerId !== question.id && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditAnswerClick(
                                          question.id,
                                          question.answer!,
                                        )
                                      }
                                      className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                      title={t("edit")}
                                    >
                                      <IconEdit size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteAnswerClick(question.id)
                                      }
                                      disabled={
                                        deletingAnswerId === question.id
                                      }
                                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                      title={t("deleteAnswer")}
                                    >
                                      <IconTrash
                                        size={14}
                                        className={
                                          deletingAnswerId === question.id
                                            ? "animate-pulse"
                                            : ""
                                        }
                                      />
                                    </button>
                                  </>
                                )}
                              </div>
                              {/* Answer text or edit input */}
                              {editingAnswerId === question.id ? (
                                <div className="mt-2 flex gap-2">
                                  <input
                                    type="text"
                                    value={editAnswerText}
                                    onChange={(e) =>
                                      setEditAnswerText(e.target.value)
                                    }
                                    className="flex-1 h-9 px-3 bg-white rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-100 focus:outline-none text-sm text-gray-900"
                                    maxLength={2000}
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        editAnswerText.trim()
                                      ) {
                                        e.preventDefault();
                                        handleUpdateAnswer(question.id);
                                      }
                                      if (e.key === "Escape") {
                                        setEditingAnswerId(null);
                                        setEditAnswerText("");
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateAnswer(question.id)
                                    }
                                    disabled={
                                      isUpdatingAnswer || !editAnswerText.trim()
                                    }
                                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    <IconCheck
                                      size={16}
                                      className={
                                        isUpdatingAnswer ? "animate-pulse" : ""
                                      }
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingAnswerId(null);
                                      setEditAnswerText("");
                                    }}
                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <IconX size={16} />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-800 mt-0.5">
                                  {question.answer}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies - nested with smaller avatars */}
                    {question.replies && question.replies.length > 0 && (
                      <div
                        className={cn(
                          "space-y-3",
                          question.answer ? "mt-3" : "mt-3",
                        )}
                      >
                        {question.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2.5">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                reply.isOwnerReply
                                  ? "bg-emerald-100"
                                  : "bg-gray-100",
                              )}
                            >
                              {reply.isOwnerReply ? (
                                <IconCheck
                                  size={16}
                                  className="text-emerald-600"
                                />
                              ) : (
                                <IconUser size={16} className="text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={cn(
                                  "rounded-2xl px-3 py-2",
                                  editingReplyId === reply.id
                                    ? "block"
                                    : "inline-block",
                                  reply.isOwnerReply
                                    ? "bg-emerald-50"
                                    : "bg-gray-100",
                                )}
                              >
                                <div className="flex items-center justify-between gap-2">
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
                                        {t("owner")}
                                      </span>
                                    )}
                                    <span
                                      className="text-[11px] text-gray-400"
                                      suppressHydrationWarning
                                    >
                                      {formatDate(reply.createdAt, tDate)}
                                    </span>
                                  </div>
                                  {canEditReply(reply.userId) &&
                                    editingReplyId !== reply.id && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleEditReplyClick(
                                            reply.id,
                                            reply.text,
                                          )
                                        }
                                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                        title={t("edit")}
                                      >
                                        <IconEdit size={14} />
                                      </button>
                                    )}
                                  {canDeleteReply(reply.userId) &&
                                    editingReplyId !== reply.id && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteReplyClick(reply.id)
                                        }
                                        disabled={deletingReplyId === reply.id}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                        title={t("deleteReply")}
                                      >
                                        <IconTrash
                                          size={14}
                                          className={
                                            deletingReplyId === reply.id
                                              ? "animate-pulse"
                                              : ""
                                          }
                                        />
                                      </button>
                                    )}
                                </div>
                                {/* Reply text or edit input */}
                                {editingReplyId === reply.id ? (
                                  <div className="mt-2 flex gap-2">
                                    <input
                                      type="text"
                                      value={editReplyText}
                                      onChange={(e) =>
                                        setEditReplyText(e.target.value)
                                      }
                                      className={cn(
                                        "flex-1 h-9 px-3 rounded-lg border focus:ring-2 focus:outline-none text-sm text-gray-900",
                                        reply.isOwnerReply
                                          ? "bg-white border-emerald-200 focus:ring-emerald-100"
                                          : "bg-white border-gray-200 focus:ring-blue-100",
                                      )}
                                      maxLength={1000}
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          editReplyText.trim()
                                        ) {
                                          e.preventDefault();
                                          handleUpdateReply(reply.id);
                                        }
                                        if (e.key === "Escape") {
                                          setEditingReplyId(null);
                                          setEditReplyText("");
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateReply(reply.id)
                                      }
                                      disabled={
                                        isUpdatingReply || !editReplyText.trim()
                                      }
                                      className={cn(
                                        "p-2 rounded-lg transition-colors disabled:opacity-50",
                                        reply.isOwnerReply
                                          ? "text-emerald-500 hover:bg-emerald-50"
                                          : "text-blue-500 hover:bg-blue-50",
                                      )}
                                    >
                                      <IconCheck
                                        size={16}
                                        className={
                                          isUpdatingReply ? "animate-pulse" : ""
                                        }
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingReplyId(null);
                                        setEditReplyText("");
                                      }}
                                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                      <IconX size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-800 mt-0.5">
                                    {reply.text}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input - always visible like the image */}
                    <div className="mt-3 flex gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <IconUser size={16} className="text-gray-400" />
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={
                            replyingToQuestionId === question.id
                              ? replyText
                              : ""
                          }
                          onChange={(e) => {
                            if (replyingToQuestionId !== question.id) {
                              if (!user) {
                                window.location.href = `/auth?redirect=/ads/item-details/${adId}`;
                                return;
                              }
                              setReplyingToQuestionId(question.id);
                            }
                            setReplyText(e.target.value);
                          }}
                          onFocus={() => {
                            if (!user) {
                              window.location.href = `/auth?redirect=/ads/item-details/${adId}`;
                              return;
                            }
                            setReplyingToQuestionId(question.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && replyText.trim()) {
                              e.preventDefault();
                              handleReplySubmit(question.id);
                            }
                          }}
                          placeholder={t("replyPlaceholder")}
                          className="w-full h-9 pl-4 pr-10 bg-gray-100 rounded-full border-0 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all"
                          maxLength={1000}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              replyingToQuestionId === question.id &&
                              replyText.trim()
                            ) {
                              handleReplySubmit(question.id);
                            }
                          }}
                          disabled={
                            isSubmittingReply ||
                            !(
                              replyingToQuestionId === question.id &&
                              replyText.trim()
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors"
                        >
                          <IconSend
                            size={16}
                            className={isSubmittingReply ? "animate-pulse" : ""}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ExpandableSection>
        </div>
      )}

      {/* Delete Question Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDeleteQuestion !== null}
        onClose={() => setConfirmDeleteQuestion(null)}
        onConfirm={handleConfirmDeleteQuestion}
        title={t("deleteQuestionTitle")}
        message={t("deleteConfirm")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        variant="danger"
        isLoading={deletingQuestionId !== null}
      />

      {/* Delete Reply Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDeleteReply !== null}
        onClose={() => setConfirmDeleteReply(null)}
        onConfirm={handleConfirmDeleteReply}
        title={t("deleteReplyTitle")}
        message={t("deleteReplyConfirm")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        variant="danger"
        isLoading={deletingReplyId !== null}
      />

      {/* Delete Answer Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDeleteAnswer !== null}
        onClose={() => setConfirmDeleteAnswer(null)}
        onConfirm={handleConfirmDeleteAnswer}
        title={t("deleteAnswerTitle")}
        message={t("deleteAnswerConfirm")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        variant="danger"
        isLoading={deletingAnswerId !== null}
      />
    </div>
  );
}
