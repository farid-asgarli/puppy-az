import { IconUsers } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import type { TeamMemberCardProps } from './team-member-card.types';

/**
 * Team member card with avatar, name, role, and description
 * Used in team/about sections
 */
export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, role, description, avatar, fallbackIcon: FallbackIcon = IconUsers, className }) => {
  return (
    <div className={cn('p-6 rounded-xl border-2 border-gray-200 text-center space-y-4', className)}>
      <div className='w-24 h-24 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden'>
        {avatar ? (
          <img src={avatar} alt={name} className='w-full h-full object-cover' />
        ) : (
          <FallbackIcon size={36} className='text-gray-400' aria-hidden='true' />
        )}
      </div>
      <div>
        <Heading variant='card' className='mb-1'>
          {name}
        </Heading>
        <Text variant='small' className='mb-3' as='p'>
          {role}
        </Text>
        <Text variant='small' as='p'>
          {description}
        </Text>
      </div>
    </div>
  );
};

export default TeamMemberCard;
