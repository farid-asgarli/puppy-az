import { IconChevronRight, IconCrown } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import TransitionLink from '@/lib/components/transition-link';
import { Text } from '@/lib/primitives/typography';
import type { AccountMenuItemProps } from './account-menu-item.types';
import { useTranslations } from 'next-intl';

/**
 * Clickable navigation menu item for account pages
 * Features icon, title, subtitle, premium badge, and chevron indicator
 */
export const AccountMenuItem: React.FC<AccountMenuItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  href,
  premium = false,
  badge,
  onClick,
  className,
}) => {
  const t = useTranslations('accessibility');

  const content = (
    <>
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div
          className={cn(
            'w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0',
            premium && 'bg-premium-100'
          )}
          aria-hidden="true"
        >
          <Icon size={20} className={cn('sm:w-[22px] sm:h-[22px]', premium ? 'text-premium-600' : 'text-gray-700')} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Text variant="body" weight="semibold" color="primary" as="span" className="text-sm sm:text-base">
              {title}
            </Text>
            {premium && <IconCrown size={14} className="sm:w-4 sm:h-4 text-premium-600 flex-shrink-0" aria-label={t('premiumFeature')} />}
            {badge !== undefined && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] sm:text-xs font-semibold min-w-[1.25rem] text-center flex-shrink-0">
                {badge}
              </span>
            )}
          </div>
          <Text variant="small" as="p" className="text-xs sm:text-sm truncate">
            {subtitle}
          </Text>
        </div>
      </div>
      <IconChevronRight size={18} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
    </>
  );

  return (
    <TransitionLink
      href={href}
      onClick={onClick}
      className={cn(
        'p-4 sm:p-5 rounded-xl border-2 border-gray-200',
        'hover:border-gray-400 hover:shadow-md',
        'transition-all duration-200',
        'flex items-center justify-between gap-3 sm:gap-4',
        className
      )}
      aria-label={`${title} - ${subtitle}`}
    >
      {content}
    </TransitionLink>
  );
};

export default AccountMenuItem;
