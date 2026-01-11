import { IconQuestionMark, IconMail, IconPhone, IconClock } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import type { ContactBannerProps } from './contact-banner.types';

/**
 * Contact banner displaying support information
 * Shows email, phone, and working hours
 */
export const ContactBanner: React.FC<ContactBannerProps> = ({
  title,
  description,
  email,
  phone,
  workingHours,
  icon: Icon = IconQuestionMark,
  className,
}) => {
  return (
    <div className={cn('p-4 sm:p-6 rounded-xl bg-gray-50 border-2 border-gray-200', className)}>
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 flex items-center justify-center" aria-hidden="true">
          <Icon size={20} className="sm:w-[22px] sm:h-[22px] text-gray-700" />
        </div>
        <div className="flex-1 min-w-0">
          <Heading variant="label" as="h3" className="mb-1 text-sm sm:text-base">
            {title}
          </Heading>
          <Text variant="small" color="secondary" className="text-xs sm:text-sm">
            {description}
          </Text>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label={`Email: ${email}`}
        >
          <IconMail size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" aria-hidden="true" />
          <span className="hover:underline truncate">{email}</span>
        </a>
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label={`Phone: ${phone}`}
        >
          <IconPhone size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" aria-hidden="true" />
          <span className="hover:underline">{phone}</span>
        </a>
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
          <IconClock size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" aria-hidden="true" />
          <span>{workingHours}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactBanner;
