import { ReactNode } from 'react';

/**
 * Props for ReviewCard component
 */
export interface ReviewCardProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Content to display in the card
   */
  children: ReactNode;

  /**
   * Optional edit callback
   */
  onEdit?: () => void;

  /**
   * Custom edit button label
   * @default 'Edit'
   */
  editLabel?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show the edit button
   * @default true (if onEdit is provided)
   */
  showEdit?: boolean;
}
