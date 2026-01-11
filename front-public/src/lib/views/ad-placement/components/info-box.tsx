'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';

interface InfoBoxProps {
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'blue' | 'red' | 'green';
  className?: string;
}

/**
 * Reusable info/tips box component
 */
export function InfoBox({ title, children, variant = 'default', className }: InfoBoxProps) {
  const variants = {
    default: 'bg-gray-50 border-gray-200',
    blue: 'bg-info-50 border-info-200',
    red: 'bg-error-50 border-error-200',
    green: 'bg-success-50 border-success-200',
  };

  const titleColors = {
    default: 'text-gray-900',
    blue: 'text-info-900',
    red: 'text-error-900',
    green: 'text-success-900',
  };

  const contentColors = {
    default: 'text-gray-600',
    blue: 'text-info-800',
    red: 'text-error-700',
    green: 'text-success-800',
  };

  return (
    <div className={cn('rounded-xl p-4 sm:p-6', variants[variant], variant !== 'default' && 'border', className)}>
      {title && (
        <Heading variant="label" as="h4" className={cn('mb-2', titleColors[variant])}>
          {title}
        </Heading>
      )}
      <div className={cn('space-y-2', contentColors[variant])}>{children}</div>
    </div>
  );
}

/**
 * List item component for InfoBox
 */
export function InfoBoxItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-gray-400 flex-shrink-0">•</span>
      <Text variant="small" as="span">
        {children}
      </Text>
    </li>
  );
}

/**
 * Checkmark list item for InfoBox
 */
export function InfoBoxCheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
      <Text variant="small" as="span">
        {children}
      </Text>
    </li>
  );
}
