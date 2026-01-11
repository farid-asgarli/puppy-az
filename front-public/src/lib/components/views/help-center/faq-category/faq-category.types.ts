export interface FAQCategoryProps {
  /**
   * Category title
   */
  title: string;

  /**
   * Category description
   */
  description: string;

  /**
   * Icon component
   */
  icon: React.ElementType;

  /**
   * Category ID (for tracking expanded FAQs)
   */
  categoryId: string;

  /**
   * Array of FAQs
   */
  faqs: Array<{
    question: string;
    answer: string;
  }>;

  /**
   * Record of expanded FAQ states
   */
  expandedFaqs: Record<string, boolean>;

  /**
   * Toggle FAQ handler
   */
  onToggleFaq: (categoryId: string, faqIndex: number) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
