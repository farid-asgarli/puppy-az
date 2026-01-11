'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Heading } from '@/lib/primitives/typography';
import type { AccordionItemProps } from './accordion-item.types';

/**
 * AccordionItem Component
 *
 * Unified accordion/collapsible component that supports both controlled and uncontrolled modes.
 * Can display with or without icon, with or without animation.
 *
 * @example
 * ```tsx
 * // Controlled mode with icon
 * <AccordionItem
 *   id="terms"
 *   title="Terms of Service"
 *   icon={IconCheck}
 *   isExpanded={isOpen}
 *   onToggle={() => setIsOpen(!isOpen)}
 * >
 *   <p>Content here</p>
 * </AccordionItem>
 *
 * // Uncontrolled mode with animation
 * <AccordionItem
 *   id="faq-1"
 *   title="What is your return policy?"
 *   defaultExpanded={false}
 *   animated={true}
 * >
 *   <p>Answer here</p>
 * </AccordionItem>
 * ```
 */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  icon: Icon,
  children,
  isExpanded: controlledExpanded,
  defaultExpanded = false,
  onToggle,
  animated = false,
  variant = 'bordered',
  className,
  headerClassName,
  contentClassName,
}) => {
  // Internal state for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  // Handle toggle
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
    // Only update internal state in uncontrolled mode
    if (!isControlled) {
      setInternalExpanded((prev) => !prev);
    }
  };

  const contentId = `accordion-content-${id}`;
  const buttonId = `accordion-button-${id}`;

  // Render content with or without animation
  const renderContent = () => {
    if (!isExpanded) return null;

    const content = (
      <div id={contentId} className={cn('border-t-2 border-gray-100 p-6', contentClassName)} role="region" aria-labelledby={buttonId}>
        {children}
      </div>
    );

    if (animated) {
      return (
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {content}
          </motion.div>
        </AnimatePresence>
      );
    }

    return content;
  };

  return (
    <div className={cn(variant === 'bordered' ? 'rounded-xl border-2 border-gray-200 overflow-hidden bg-white' : '', className)}>
      {/* Header Button */}
      <button
        id={buttonId}
        onClick={handleToggle}
        className={cn('w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left', headerClassName)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        type="button"
      >
        {/* Icon (optional) */}
        {Icon && (
          <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Icon size={22} className="text-gray-700" />
          </div>
        )}

        {/* Title */}
        <div className="flex-1">
          {typeof title === 'string' ? (
            <Heading variant="label" as="h3">
              {title}
            </Heading>
          ) : (
            title
          )}
        </div>

        {/* Chevron Icon */}
        {isExpanded ? (
          <IconChevronUp size={20} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
        ) : (
          <IconChevronDown size={20} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
        )}
      </button>

      {/* Content Area */}
      {renderContent()}
    </div>
  );
};

export default AccordionItem;
