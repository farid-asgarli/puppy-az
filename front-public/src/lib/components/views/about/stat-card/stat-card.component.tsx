import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import type { StatCardProps } from './stat-card.types';

/**
 * Stat card displaying a metric with icon, value, and label
 * Used in statistics/achievements sections
 */
export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, className }) => {
  return (
    <div className={cn('p-6 rounded-xl border-2 border-gray-200 text-center space-y-3', className)}>
      <div className='w-12 h-12 mx-auto rounded-xl bg-gray-100 flex items-center justify-center' aria-hidden='true'>
        <Icon size={24} className='text-gray-700' />
      </div>
      <Heading variant='section'>{value}</Heading>
      <Text variant='small' as='div'>
        {label}
      </Text>
    </div>
  );
};

export default StatCard;
