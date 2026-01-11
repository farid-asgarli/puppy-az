import { Text } from '@/lib/primitives/typography';
import type { UserRightsListProps } from './user-rights-list.types';

/**
 * Displays a list of user rights with bold labels and descriptions
 * Used for privacy rights, terms conditions, or feature lists
 *
 * @example
 * ```tsx
 * <UserRightsList
 *   rights={[
 *     { label: 'Access Data', description: 'View all your stored information' },
 *     { label: 'Delete Account', description: 'Permanently remove your data' }
 *   ]}
 * />
 * ```
 */
export const UserRightsList: React.FC<UserRightsListProps> = ({ rights, className }) => {
  return (
    <div className={className} role="list">
      {rights.map((right, index) => (
        <p key={index} className="flex items-start gap-2" role="listitem">
          <span className="mt-0.5" aria-hidden="true">
            •
          </span>
          <Text variant="small" as="span">
            <strong>{right.label}</strong> - {right.description}
          </Text>
        </p>
      ))}
    </div>
  );
};

export default UserRightsList;
