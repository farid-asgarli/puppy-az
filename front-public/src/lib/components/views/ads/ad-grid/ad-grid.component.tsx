import { cn } from '@/lib/external/utils';
import type { AdGridProps, AdGridVariant } from './ad-grid.types';

const variantStyles: Record<AdGridVariant, string> = {
  standard:
    'grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-5 min-[480px]:[&>*]:max-w-[290px] justify-items-center',
  compact:
    'grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 lg:gap-4 min-[480px]:[&>*]:max-w-[260px] justify-items-center',
  large:
    'grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 min-[480px]:[&>*]:max-w-[340px] justify-items-center',
};

/**
 * AdGrid Component
 * Responsive grid layout for ad listings
 * Provides consistent spacing and breakpoints across different screen sizes
 */
export const AdGrid: React.FC<AdGridProps> = ({ children, variant = 'standard', className }) => {
  return <div className={cn(variantStyles[variant], className)}>{children}</div>;
};

export default AdGrid;
