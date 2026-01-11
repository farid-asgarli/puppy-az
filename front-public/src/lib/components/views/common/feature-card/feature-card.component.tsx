import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import type { FeatureCardProps } from './feature-card.types';

/**
 * FeatureCard Component
 *
 * Card component for displaying features, benefits, or values.
 * Commonly used in marketing/about pages to showcase key points.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={IconShield}
 *   title="Güvənli Alış-veriş"
 *   description="Bütün əməliyyatlar 256-bit SSL ilə şifrələnir"
 * />
 * ```
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, className }) => {
  return (
    <div className={cn('p-5 sm:p-6 rounded-xl border-2 border-gray-200 space-y-3 sm:space-y-4', className)}>
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center" aria-hidden="true">
        <Icon size={20} className="sm:w-6 sm:h-6 text-gray-700" />
      </div>
      <div>
        <Heading variant="card" className="mb-2 text-base sm:text-lg">
          {title}
        </Heading>
        <Text variant="body" className="text-sm sm:text-base">
          {description}
        </Text>
      </div>
    </div>
  );
};

export default FeatureCard;
