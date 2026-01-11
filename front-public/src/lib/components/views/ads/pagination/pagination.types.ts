export interface PaginationProps {
  /**
   * Current active page (1-indexed)
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Page change handler
   */
  onPageChange: (page: number) => void;

  /**
   * Maximum visible page numbers (excluding first/last and ellipsis)
   * @default 5
   */
  maxVisible?: number;

  /**
   * Whether to always show first and last page numbers
   * @default true
   */
  showEdgePages?: boolean;

  /**
   * Whether pagination is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes for container
   */
  className?: string;
}
