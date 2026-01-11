export interface ExpandableSectionProps {
  /**
   * Content to display (can be text or React elements)
   */
  children: React.ReactNode;

  /**
   * Type of content being collapsed
   * - 'text': Character-based threshold (for description)
   * - 'items': Item-based threshold (for lists like questions)
   */
  type?: 'text' | 'items';

  /**
   * Threshold for collapsing
   * - For 'text': character count
   * - For 'items': number of items
   * @default 300 for text, 3 for items
   */
  threshold?: number;

  /**
   * Label for expand button
   * @default 'Daha çox göstər'
   */
  expandLabel?: string;

  /**
   * Label for collapse button
   * @default 'Daha az göstər'
   */
  collapseLabel?: string;

  /**
   * Initial expanded state
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Custom render function for collapsed content
   * Receives the children and should return the collapsed version
   */
  renderCollapsed?: (children: React.ReactNode) => React.ReactNode;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Additional CSS classes for the toggle button
   */
  buttonClassName?: string;
}
