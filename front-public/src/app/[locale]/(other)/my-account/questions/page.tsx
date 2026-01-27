import { redirect } from '@/i18n';
import { getLocale } from 'next-intl/server';
import { getMyAdsQuestionsAction, getMyAdsQuestionsSummaryAction } from '@/lib/auth/actions';
import { QuestionsView } from '@/lib/views/my-account/questions';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.questions');
}

interface QuestionsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const pageSize = 10;

  // Fetch questions and summary server-side
  const [questionsResult, summaryResult] = await Promise.all([
    getMyAdsQuestionsAction({
      pagination: {
        number: page,
        size: pageSize,
      },
    }),
    getMyAdsQuestionsSummaryAction(),
  ]);

  // Redirect to login if not authenticated
  if (!questionsResult.success || !summaryResult.success) {
    return redirect({ href: '/auth?redirect=/my-account/questions', locale });
  }

  return <QuestionsView initialData={questionsResult.data} initialSummary={summaryResult.data} initialPage={page} />;
}
