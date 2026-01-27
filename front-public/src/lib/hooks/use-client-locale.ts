import { useParams } from '@/i18n';

export function useLocale() {
  const params = useParams();
  return params.locale as string;
}
