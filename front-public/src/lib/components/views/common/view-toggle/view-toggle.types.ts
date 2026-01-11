export type ViewMode = 'grid' | 'list';

export interface ViewToggleProps {
  /**
   * Current view mode
   */
  mode: ViewMode;

  /**
   * Callback when mode changes
   */
  onModeChange: (mode: ViewMode) => void;

  /**
   * Grid view button label (for accessibility)
   * @default 'Şəbəkə görünüşü'
   */
  gridLabel?: string;

  /**
   * List view button label (for accessibility)
   * @default 'Siyahı görünüşü'
   */
  listLabel?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
