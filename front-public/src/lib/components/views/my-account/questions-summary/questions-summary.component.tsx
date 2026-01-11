'use client';

import { useTranslations } from 'next-intl';
import { IconMessageCircle, IconClock, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { MyAdQuestionsSummaryDto } from '@/lib/api/types/pet-ad.types';
import { Heading, Text } from '@/lib/primitives/typography';
import { formatDate } from '@/lib/utils/date-utils';

interface QuestionsSummaryProps {
  summary: MyAdQuestionsSummaryDto;
  loading?: boolean;
}

/**
 * QuestionsSummary - Dashboard stats card for Q&A management
 *
 * Features:
 * - Shows total questions, unanswered count, ads with questions
 * - Displays latest unanswered question timestamp
 * - Responsive grid layout
 * - Loading skeleton state
 * - Color-coded stats (urgent items highlighted)
 */
export function QuestionsSummary({ summary, loading = false }: QuestionsSummaryProps) {
  const t = useTranslations('myAccount.questions.summary');
  const tDate = useTranslations('dateTime');

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl border-2 border-gray-200 bg-white">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      id: 'total',
      icon: IconMessageCircle,
      value: summary.totalQuestions,
      label: t('totalQuestions'),
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      id: 'unanswered',
      icon: IconClock,
      value: summary.unansweredQuestions,
      label: t('unansweredQuestions'),
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      highlight: summary.unansweredQuestions > 0,
    },
    {
      id: 'ads',
      icon: IconAlertCircle,
      value: summary.adsWithUnansweredQuestions,
      label: t('adsWithQuestions'),
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      id: 'answered',
      icon: IconCheck,
      value: summary.totalQuestions - summary.unansweredQuestions,
      label: t('answeredQuestions', { defaultValue: 'Answered' }),
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;

          return (
            <div
              key={stat.id}
              className={cn(
                'p-5 sm:p-6 rounded-2xl border-2 bg-white transition-all duration-300',
                stat.highlight ? 'border-amber-300 shadow-lg shadow-amber-100 scale-[1.02]' : stat.borderColor
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn('p-2.5 rounded-xl', stat.bgColor)}>
                  <StatIcon size={20} strokeWidth={2} className={stat.iconColor} />
                </div>
                {stat.highlight && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Action</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Heading variant="section" className="text-2xl sm:text-3xl font-bold">
                  {stat.value}
                </Heading>
                <Text variant="small" color="secondary" className="text-xs sm:text-sm">
                  {stat.label}
                </Text>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest Question Alert */}
      {summary.latestUnansweredQuestionAt && summary.unansweredQuestions > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <IconClock size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <Text variant="body" weight="medium" className="text-amber-900 mb-1">
              {t('latestQuestion')}
            </Text>
            <Text variant="small" color="secondary" className="text-amber-700">
              {formatDate(summary.latestUnansweredQuestionAt, tDate)}
            </Text>
          </div>
        </div>
      )}

      {/* All Caught Up Message */}
      {summary.unansweredQuestions === 0 && summary.totalQuestions > 0 && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
          <IconCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <Text variant="body" weight="medium" className="text-green-900">
              All questions answered! Great job! 🎉
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}
