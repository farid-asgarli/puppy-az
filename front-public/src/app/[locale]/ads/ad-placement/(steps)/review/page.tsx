import ReviewView from '@/lib/views/ad-placement/views/review-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.review');
}

export default function ReviewPage() {
  return <ReviewView />;
}
