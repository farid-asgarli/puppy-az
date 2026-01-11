import { redirect } from 'next/navigation';
import { getMyAdsQuestionsAction, getMyAdsQuestionsSummaryAction } from '@/lib/auth/actions';
import { QuestionsView } from '@/lib/views/my-account/questions';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.questions');
}

interface QuestionsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
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
    redirect('/auth?redirect=/my-account/questions');
  }

  return <QuestionsView initialData={questionsResult.data} initialSummary={summaryResult.data} initialPage={page} />;
}
