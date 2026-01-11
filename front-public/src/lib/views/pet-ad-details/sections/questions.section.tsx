'use client';

import React, { useState } from 'react';
import { PetAdQuestionDto } from '@/lib/api/types/pet-ad.types';
import { cn } from '@/lib/external/utils';
import { IconMessageCircle, IconX, IconUser } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date-utils';
import { useAuth } from '@/lib/hooks/use-auth';
import Button from '@/lib/primitives/button/button.component';
import { ExpandableSection } from '@/lib/components/views/pet-ad-details/expandable-section';
import { EmptyState, SectionHeader } from '@/lib/components/views/common';
import { askQuestionAction, answerQuestionAction } from '@/lib/auth/actions';
import { StatusMessage } from '@/lib/components/views/my-account/status-message/status-message.component';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

export interface AdDetailsQuestionsSectionProps {
  questions: PetAdQuestionDto[];
  adId: number;
  ownerId: string;
}

export function AdDetailsQuestionsSection({ questions, adId, ownerId }: AdDetailsQuestionsSectionProps) {
  const t = useTranslations('petAdDetails.questions');
  const tDate = useTranslations('dateTime');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  // Track which question is being answered
  const [answeringQuestionId, setAnsweringQuestionId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Check if current user is the ad owner
  const isOwner = user?.id === ownerId;

  // Filter questions based on whether user is owner
  const displayQuestions = isOwner ? questions : questions.filter((q) => q.isAnswered);

  // Handle answer submission
  const handleAnswerSubmit = async (questionId: number) => {
    if (!answerText.trim() || isSubmittingAnswer) return;

    setIsSubmittingAnswer(true);

    try {
      const result = await answerQuestionAction(questionId, answerText.trim());

      if (!result.success) {
        toast.error(result.error || t('answerError'));
        return;
      }

      toast.success(t('answerSuccess'));
      setAnsweringQuestionId(null);
      setAnswerText('');

      // Refresh the page to show the new answer
      router.refresh();
    } catch (error) {
      console.error('Failed to submit answer:', error);
      toast.error(t('answerError'));
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const openModal = () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/auth?redirect=/ads/item-details/${adId}`;
      return;
    }
    setIsModalOpen(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionText('');
    setSubmitStatus('idle');
    setErrorMessage('');
    document.body.style.overflow = 'unset';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const result = await askQuestionAction(adId, questionText.trim());

      if (!result.success) {
        setSubmitStatus('error');
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      setSubmitStatus('success');
      setQuestionText('');

      // Close modal after a short delay to show success message
      setTimeout(() => {
        closeModal();
        // Refresh the page to show the new question
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Failed to submit question:', error);
      setSubmitStatus('error');
      setErrorMessage(t('modal.error.default'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <SectionHeader
          title={t('title')}
          layout="horizontal"
          action={{
            label: t('askQuestion'),
            icon: IconMessageCircle,
            onClick: openModal,
          }}
        />

        {displayQuestions.length === 0 ? (
          <EmptyState
            variant="bordered"
            icon={IconMessageCircle}
            message={t('noQuestions')}
            action={{
              label: t('beFirst'),
              icon: IconMessageCircle,
              onClick: openModal,
            }}
          />
        ) : (
          <ExpandableSection
            type="items"
            threshold={3}
            expandLabel={t('showAll', { count: displayQuestions.length })}
            collapseLabel={t('showLess')}
            className="space-y-3 sm:space-y-4"
            buttonClassName="w-full"
            renderCollapsed={(children) => {
              if (Array.isArray(children)) {
                return children.slice(0, 3);
              }
              return children;
            }}
          >
            {displayQuestions.map((question) => (
              <div key={question.id} className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 space-y-3 sm:space-y-4">
                {/* Question */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <IconUser size={14} className="sm:w-4 sm:h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm sm:text-base font-semibold text-gray-900">{question.questionerName}</span>
                        <span className="text-xs sm:text-sm text-gray-500">·</span>
                        <span className="text-xs sm:text-sm text-gray-500">{formatDate(question.askedAt, tDate)}</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700">{question.question}</p>
                    </div>
                  </div>
                </div>

                {/* Answer or Answer Form */}
                {question.answer ? (
                  <div className="pl-9 sm:pl-11 space-y-2">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">{t('answer')}</span>
                        {question.answeredAt && (
                          <>
                            <span className="text-xs sm:text-sm text-gray-400">·</span>
                            <span className="text-xs sm:text-sm text-gray-500">{formatDate(question.answeredAt, tDate)}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-gray-700">{question.answer}</p>
                    </div>
                  </div>
                ) : isOwner && answeringQuestionId === question.id ? (
                  <div className="pl-9 sm:pl-11 space-y-2">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder={t('answerPlaceholder')}
                      className={cn(
                        'w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-gray-200',
                        'focus:border-blue-500 focus:outline-none text-sm sm:text-base',
                        'resize-none text-gray-900 placeholder:text-gray-400',
                        'min-h-[80px]'
                      )}
                      maxLength={1000}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500">{answerText.length}/1000</span>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setAnsweringQuestionId(null);
                            setAnswerText('');
                          }}
                          disabled={isSubmittingAnswer}
                        >
                          {t('cancel')}
                        </Button>
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => handleAnswerSubmit(question.id)}
                          disabled={isSubmittingAnswer || !answerText.trim()}
                        >
                          {isSubmittingAnswer ? t('submitting') : t('sendAnswer')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : isOwner ? (
                  <div className="pl-9 sm:pl-11">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setAnsweringQuestionId(question.id);
                        setAnswerText('');
                      }}
                    >
                      {t('answerQuestion')}
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
          </ExpandableSection>
        )}
      </div>

      {/* Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{t('modal.title')}</h3>
              <button
                onClick={closeModal}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
                aria-label={t('modal.close')}
              >
                <IconX size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Success Message */}
              {submitStatus === 'success' && (
                <StatusMessage variant="success" title={t('modal.success.title')} message={t('modal.success.message')} />
              )}

              {/* Error Message */}
              {submitStatus === 'error' && <StatusMessage variant="error" title={t('modal.error.title')} message={errorMessage} />}

              <div className="space-y-2">
                <label htmlFor="question" className="block text-xs sm:text-sm font-medium text-gray-900">
                  {t('modal.questionLabel')}
                </label>
                <textarea
                  id="question"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder={t('modal.placeholder')}
                  className={cn(
                    'w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-gray-200',
                    'focus:border-gray-400 focus:outline-none text-sm sm:text-base',
                    'resize-none text-gray-900 placeholder:text-gray-400',
                    'min-h-[100px] sm:min-h-[120px]'
                  )}
                  maxLength={500}
                  required
                  disabled={submitStatus === 'success'}
                />
                <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                  <span>{t('modal.helper')}</span>
                  <span>{t('modal.characterCount', { current: questionText.length, max: 500 })}</span>
                </div>
              </div>

              {/* Modal Footer */}
              {submitStatus !== 'success' && (
                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={cn(
                      'flex-1 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl border-2 border-gray-200',
                      'hover:border-gray-400 text-sm sm:text-base font-semibold text-gray-700',
                      'transition-all duration-200'
                    )}
                    disabled={isSubmitting}
                  >
                    {t('modal.cancel')}
                  </button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="flex-1 rounded-xl font-semibold text-sm sm:text-base"
                    disabled={isSubmitting || !questionText.trim()}
                  >
                    {isSubmitting ? t('modal.submitting') : t('modal.submit')}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
