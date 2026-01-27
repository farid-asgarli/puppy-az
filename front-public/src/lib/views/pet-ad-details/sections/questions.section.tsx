'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PetAdQuestionDto } from '@/lib/api/types/pet-ad.types';
import { cn } from '@/lib/external/utils';
import { IconMessageCircle, IconUser, IconSend, IconCheck } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date-utils';
import { useAuth } from '@/lib/hooks/use-auth';
import { ExpandableSection } from '@/lib/components/views/pet-ad-details/expandable-section';
import { SectionHeader } from '@/lib/components/views/common';
import { askQuestionAction, answerQuestionAction, replyToQuestionAction } from '@/lib/auth/actions';
import { useRouter } from '@/i18n';
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
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const questionInputRef = useRef<HTMLInputElement>(null);

  // Track which question is being replied to
  const [replyingToQuestionId, setReplyingToQuestionId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const replyInputRef = useRef<HTMLInputElement>(null);

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

  // Handle reply submission
  const handleReplySubmit = async (questionId: number) => {
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);

    try {
      const result = await replyToQuestionAction(questionId, replyText.trim());

      if (!result.success) {
        toast.error(result.error || t('replyError'));
        return;
      }

      toast.success(t('replySuccess'));
      setReplyingToQuestionId(null);
      setReplyText('');

      // Refresh the page to show the new reply
      router.refresh();
    } catch (error) {
      console.error('Failed to submit reply:', error);
      toast.error(t('replyError'));
    } finally {
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

  // Handle reply button click
  const handleReplyClick = (questionId: number) => {
    if (!user) {
      window.location.href = `/auth?redirect=/ads/item-details/${adId}`;
      return;
    }
    setReplyingToQuestionId(questionId);
    setReplyText('');
  };

  // Handle question submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await askQuestionAction(adId, questionText.trim());

      if (!result.success) {
        toast.error(result.error || t('modal.error.default'));
        setIsSubmitting(false);
        return;
      }

      toast.success(t('modal.success.message'));
      setQuestionText('');
      setIsInputFocused(false);

      // Refresh the page to show the new question
      router.refresh();
    } catch (error) {
      console.error('Failed to submit question:', error);
      toast.error(t('modal.error.default'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <SectionHeader title={t('title')} layout='horizontal' />

      {/* Ask Question - Simple input like the image */}
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0'>
            <IconUser size={20} className='text-gray-400' />
          </div>
          <div className='flex-1 relative'>
            <input
              ref={questionInputRef}
              type='text'
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              onFocus={handleQuestionFocus}
              onBlur={() => !questionText && setIsInputFocused(false)}
              placeholder={t('modal.placeholder')}
              className='w-full h-10 pl-4 pr-10 bg-gray-100 rounded-full border-0 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all'
              maxLength={500}
            />
            <button
              type='submit'
              disabled={isSubmitting || !questionText.trim()}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors'
            >
              <IconSend size={18} className={isSubmitting ? 'animate-pulse' : ''} />
            </button>
          </div>
        </div>
      </form>

      {/* Questions */}
      {displayQuestions.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-400 text-sm'>{t('noQuestions')}</p>
        </div>
      ) : (
        <div className='mt-4 divide-y divide-gray-100'>
          <ExpandableSection
            type='items'
            threshold={3}
            expandLabel={t('showAll', { count: displayQuestions.length })}
            collapseLabel={t('showLess')}
            className='divide-y divide-gray-100'
            buttonClassName='text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors py-3'
            renderCollapsed={(children) => {
              if (Array.isArray(children)) {
                return children.slice(0, 3);
              }
              return children;
            }}
          >
            {displayQuestions.map((question) => (
              <div key={question.id} className='py-4'>
                {/* Question with avatar */}
                <div className='flex gap-3'>
                  <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                    <IconUser size={20} className='text-blue-600' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold text-sm text-gray-900'>{question.questionerName}</span>
                      <span className='text-xs text-gray-400'>{formatDate(question.askedAt, tDate)}</span>
                    </div>
                    <p className='text-[15px] text-gray-800 mt-0.5 leading-relaxed'>{question.question}</p>

                    {/* Replies - nested with smaller avatars */}
                    {question.replies && question.replies.length > 0 && (
                      <div className='mt-3 space-y-3'>
                        {question.replies.map((reply) => (
                          <div key={reply.id} className='flex gap-2.5'>
                            <div
                              className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                                reply.isOwnerReply ? 'bg-emerald-100' : 'bg-gray-100',
                              )}
                            >
                              {reply.isOwnerReply ? <IconCheck size={16} className='text-emerald-600' /> : <IconUser size={16} className='text-gray-500' />}
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className={cn('inline-block rounded-2xl px-3 py-2', reply.isOwnerReply ? 'bg-emerald-50' : 'bg-gray-100')}>
                                <div className='flex items-center gap-2'>
                                  <span className={cn('font-semibold text-[13px]', reply.isOwnerReply ? 'text-emerald-700' : 'text-gray-900')}>
                                    {reply.userName}
                                  </span>
                                  {reply.isOwnerReply && (
                                    <span className='text-[10px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full'>{t('owner')}</span>
                                  )}
                                </div>
                                <p className='text-sm text-gray-800 mt-0.5'>{reply.text}</p>
                              </div>
                              <div className='flex items-center gap-4 mt-1 ml-3'>
                                <span className='text-[11px] text-gray-400'>{formatDate(reply.createdAt, tDate)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input - always visible like the image */}
                    <div className='mt-3 flex gap-2.5'>
                      <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                        <IconUser size={16} className='text-gray-400' />
                      </div>
                      <div className='flex-1 relative'>
                        <input
                          type='text'
                          value={replyingToQuestionId === question.id ? replyText : ''}
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
                            if (e.key === 'Enter' && replyText.trim()) {
                              e.preventDefault();
                              handleReplySubmit(question.id);
                            }
                          }}
                          placeholder={t('replyPlaceholder')}
                          className='w-full h-9 pl-4 pr-10 bg-gray-100 rounded-full border-0 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all'
                          maxLength={1000}
                        />
                        <button
                          type='button'
                          onClick={() => {
                            if (replyingToQuestionId === question.id && replyText.trim()) {
                              handleReplySubmit(question.id);
                            }
                          }}
                          disabled={isSubmittingReply || !(replyingToQuestionId === question.id && replyText.trim())}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors'
                        >
                          <IconSend size={16} className={isSubmittingReply ? 'animate-pulse' : ''} />
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
    </div>
  );
}
