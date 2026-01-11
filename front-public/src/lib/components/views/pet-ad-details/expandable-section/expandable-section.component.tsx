'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/external/utils';
import { Text } from '@/lib/primitives/typography';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { ExpandableSectionProps } from './expandable-section.types';
import { useTranslations } from 'next-intl';

/**
 * ExpandableSection Component
 *
 * Reusable collapsible content section with "Show More/Less" functionality.
 * Supports two modes:
 * - Text mode: Collapses based on character count
 * - Items mode: Collapses based on number of items (for lists)
 *
 * Used in description and questions sections.
 */
export function ExpandableSection({
  children,
  type = 'text',
  threshold,
  expandLabel,
  collapseLabel,
  defaultExpanded = false,
  renderCollapsed,
  className,
  buttonClassName,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const t = useTranslations('common');

  const defaultExpandLabel = expandLabel || t('showMore');
  const defaultCollapseLabel = collapseLabel || t('showLess');

  // Default thresholds
  const defaultThreshold = type === 'text' ? 300 : 3;
  const finalThreshold = threshold ?? defaultThreshold;

  // Determine if content needs collapsing
  const needsCollapsing = useMemo(() => {
    if (type === 'text' && typeof children === 'string') {
      return children.length > finalThreshold;
    }
    if (type === 'items' && Array.isArray(children)) {
      return children.length > finalThreshold;
    }
    return false;
  }, [children, type, finalThreshold]);

  // Get display content based on expanded state
  const displayContent = useMemo(() => {
    if (isExpanded || !needsCollapsing) {
      return children;
    }

    // Use custom render function if provided
    if (renderCollapsed) {
      return renderCollapsed(children);
    }

    // Default text collapsing
    if (type === 'text' && typeof children === 'string') {
      return children.slice(0, finalThreshold) + '...';
    }

    // Default items collapsing
    if (type === 'items' && Array.isArray(children)) {
      return children.slice(0, finalThreshold);
    }

    return children;
  }, [children, isExpanded, needsCollapsing, type, finalThreshold, renderCollapsed]);

  // If content doesn't need collapsing, just render it
  if (!needsCollapsing) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {/* Content */}
      <div>{displayContent}</div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl mt-4',
          'border-2 border-gray-200 hover:border-gray-400',
          'text-gray-700 transition-all duration-200',
          buttonClassName
        )}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <>
            <IconChevronUp size={18} />
            <Text variant="body" weight="medium" as="span">
              {defaultCollapseLabel}
            </Text>
          </>
        ) : (
          <>
            <IconChevronDown size={18} />
            <Text variant="body" weight="medium" as="span">
              {defaultExpandLabel}
            </Text>
          </>
        )}
      </button>
    </div>
  );
}
