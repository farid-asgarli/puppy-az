import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import { FAQItem } from '@/lib/components/views/common/accordion';
import type { FAQCategoryProps } from './faq-category.types';

/**
 * FAQ category section with header and FAQ items
 * Groups related FAQs under a category
 */
export const FAQCategory: React.FC<FAQCategoryProps> = ({
  title,
  description,
  icon: Icon,
  categoryId,
  faqs,
  expandedFaqs,
  onToggleFaq,
  className,
}) => {
  return (
    <div className={cn('rounded-xl border-2 border-gray-200 overflow-hidden', className)}>
      {/* Category Header */}
      <div className="p-4 sm:p-6 bg-gray-50 border-b-2 border-gray-200">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <Icon size={20} className="sm:w-6 sm:h-6 text-gray-700" />
          </div>
          <div className="min-w-0">
            <Heading variant="card" as="h2" className="text-base sm:text-lg">
              {title}
            </Heading>
            <Text variant="small" color="secondary" className="mt-1 text-xs sm:text-sm">
              {description}
            </Text>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white divide-y divide-gray-200">
        {faqs.map((faq, faqIndex) => {
          const key = `${categoryId}-${faqIndex}`;
          const isExpanded = expandedFaqs[key];

          return (
            <FAQItem
              key={faqIndex}
              question={faq.question}
              answer={faq.answer}
              isExpanded={isExpanded}
              onToggle={() => onToggleFaq(categoryId, faqIndex)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FAQCategory;
