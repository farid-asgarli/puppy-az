'use client';

import { Text } from '@/lib/primitives/typography';
import { AccordionItem } from './accordion-item.component';
import type { FAQItemProps } from './faq-item.types';

/**
 * FAQItem Component
 *
 * Specialized accordion component for FAQ (Question & Answer) format.
 * Built on top of AccordionItem with simplified props and FAQ-specific styling.
 *
 * @example
 * ```tsx
 * <FAQItem
 *   question="What is your return policy?"
 *   answer="You can return items within 30 days."
 *   animated={true}
 * />
 * ```
 */
export const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isExpanded,
  defaultExpanded = false,
  onToggle,
  animated = true,
  variant = 'borderless',
  className,
}) => {
  return (
    <AccordionItem
      id={`faq-${question}`}
      title={
        <Text variant="body" weight="semibold" as="span">
          {question}
        </Text>
      }
      isExpanded={isExpanded}
      defaultExpanded={defaultExpanded}
      onToggle={onToggle}
      animated={animated}
      variant={variant}
      className={className}
      headerClassName="px-6 py-5"
      contentClassName="px-6 pb-5 pt-0 border-t-0"
    >
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">{answer}</div>
    </AccordionItem>
  );
};

export default FAQItem;
