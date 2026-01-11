import { AdPlacementProvider } from '@/lib/contexts/ad-placement-context';

export default function AdPlacementLayout({ children }: { children: React.ReactNode }) {
  // Note: Authentication is already handled by middleware
  // This route is protected per project instructions

  return <AdPlacementProvider>{children}</AdPlacementProvider>;
}
