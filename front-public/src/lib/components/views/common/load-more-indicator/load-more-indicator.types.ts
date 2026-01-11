export interface LoadMoreIndicatorProps {
  /**
   * Whether more content is currently loading
   */
  isLoading: boolean;

  /**
   * Whether there is more content to load
   */
  hasMore: boolean;

  /**
   * Optional count of loaded items
   */
  loadedCount?: number;

  /**
   * Loading message text
   * @default 'Yüklənir...'
   */
  loadingText?: string;

  /**
   * Completed message text (when no more items)
   * @default 'Bütün məlumatlar yükləndi'
   */
  completedText?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
