'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { IconMessageCircle, IconClock, IconCheck } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/external/utils';
import { MyAdQuestionDto, MyAdQuestionsSummaryDto } from '@/lib/api/types/pet-ad.types';
import { PaginatedResult } from '@/lib/api/types/common.types';
import { getMyAdsQuestionsAction, answerQuestionAction } from '@/lib/auth/actions';
import { usePaginatedData } from '@/lib/hooks/use-paginated-data';
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll';
import { QuestionCard, QuestionsSummary } from '@/lib/components/views/my-account';
import { Heading, Text } from '@/lib/primitives/typography';
import { EmptyState } from '@/lib/primitives/empty-state';
import { Spinner } from '@/lib/primitives/spinner';

type FilterTab = 'all' | 'unanswered' | 'answered';

interface QuestionsViewProps {
  initialData: PaginatedResult<MyAdQuestionDto>;
  initialSummary: MyAdQuestionsSummaryDto;
  initialPage: number;
}

/**
 * QuestionsView - Main view for Q&A management
 *
 * Features:
 * - Stats summary dashboard
 * - Filter tabs (All, Unanswered, Answered)
 * - Infinite scroll question list
 * - Inline answer functionality
 * - Empty states for each filter
 * - Real-time updates after answering
 */
export default function QuestionsView({ initialData, initialSummary, initialPage }: QuestionsViewProps) {
  const t = useTranslations('myAccount.questions');
  const tCommon = useTranslations('common');

  const [summary, setSummary] = useState(initialSummary);
  const [activeTab, setActiveTab] = useState<FilterTab>('unanswered');

  // Paginated data with infinite scroll
  const {
    items: questions,
    hasMore,
    isLoading: isLoadingMore,
    loadMore,
    setItems: setQuestions,
  } = usePaginatedData({
    initialData,
    initialPage,
    pageSize: 10,
    fetchAction: getMyAdsQuestionsAction,
  });

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
    threshold: 300,
  });

  // Filter questions based on active tab
  const filteredQuestions = useMemo(() => {
    if (activeTab === 'all') return questions;
    if (activeTab === 'unanswered') return questions.filter((q) => !q.isAnswered);
    if (activeTab === 'answered') return questions.filter((q) => q.isAnswered);
    return questions;
  }, [questions, activeTab]);

  // Handle answer submission
  const handleAnswerSubmit = async (questionId: number, answer: string) => {
    try {
      const result = await answerQuestionAction(questionId, answer);

      if (result.success) {
        // Update the question in the list
        setQuestions((prev) =>
          prev.map((q) => (q.questionId === questionId ? { ...q, answer, isAnswered: true, answeredAt: new Date().toISOString() } : q))
        );

        // Update summary stats
        setSummary((prev) => ({
          ...prev,
          unansweredQuestions: Math.max(0, prev.unansweredQuestions - 1),
        }));

        toast.success(t('notifications.answerSuccess'));
      } else {
        toast.error(result.error || t('notifications.answerError'));
      }
    } catch (error) {
      console.error('Answer submission error:', error);
      toast.error(t('notifications.answerError'));
    }
  };

  // Filter tabs configuration
  const tabs: Array<{ id: FilterTab; label: string; icon: typeof IconMessageCircle; count?: number }> = [
    {
      id: 'all',
      label: t('tabs.all'),
      icon: IconMessageCircle,
      count: summary.totalQuestions,
    },
    {
      id: 'unanswered',
      label: t('tabs.unanswered'),
      icon: IconClock,
      count: summary.unansweredQuestions,
    },
    {
      id: 'answered',
      label: t('tabs.answered'),
      icon: IconCheck,
      count: summary.totalQuestions - summary.unansweredQuestions,
    },
  ];

  // Empty state configuration based on active tab
  const emptyStateConfig = {
    all: {
      icon: IconMessageCircle,
      title: t('emptyStates.noQuestions.title'),
      description: t('emptyStates.noQuestions.description'),
    },
    unanswered: {
      icon: IconCheck,
      title: t('emptyStates.noUnanswered.title'),
      description: t('emptyStates.noUnanswered.description'),
    },
    answered: {
      icon: IconMessageCircle,
      title: t('emptyStates.noAnswered.title'),
      description: t('emptyStates.noAnswered.description'),
    },
  };

  const currentEmptyState = emptyStateConfig[activeTab];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-1 sm:space-y-2">
            <Heading variant="page-title" as="h1" className="text-2xl sm:text-3xl lg:text-4xl">
              {t('title')}
            </Heading>
            <Text variant="body-lg" color="secondary" className="text-base sm:text-lg">
              {t('subtitle')}
            </Text>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        <div className="space-y-8">
          {/* Stats Summary */}
          <QuestionsSummary summary={summary} loading={false} />

          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto -mb-px">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b-2 transition-all duration-200 whitespace-nowrap',
                      'font-medium text-sm sm:text-base',
                      isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <TabIcon size={18} className="shrink-0" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-bold',
                          isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions List */}
          {filteredQuestions.length === 0 ? (
            <EmptyState
              icon={<currentEmptyState.icon size={48} strokeWidth={1.5} />}
              title={currentEmptyState.title}
              description={currentEmptyState.description}
            />
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <QuestionCard key={question.questionId} question={question} onAnswerSubmit={handleAnswerSubmit} />
              ))}

              {/* Load More Indicator */}
              {hasMore && (
                <div ref={loadMoreRef} className="py-8 flex justify-center">
                  {isLoadingMore && <Spinner size="md" text={tCommon('loading')} />}
                </div>
              )}

              {/* End of List Message */}
              {!hasMore && filteredQuestions.length > 5 && (
                <div className="py-8 text-center">
                  <Text variant="body" color="secondary">
                    {t('endOfList', { defaultValue: "You've reached the end" })}
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
