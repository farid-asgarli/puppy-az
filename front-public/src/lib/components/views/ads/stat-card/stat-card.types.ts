export interface Stat {
  /**
   * Stat value (e.g., "10,000+", "24/7")
   */
  value: string;

  /**
   * Stat label/description
   */
  label: string;

  /**
   * Icon component from tabler-icons
   */
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface StatCardProps {
  /**
   * Array of stats to display/rotate
   */
  stats: Stat[];

  /**
   * Whether to auto-rotate through stats
   * @default true
   */
  autoRotate?: boolean;

  /**
   * Rotation interval in milliseconds
   * @default 3000
   */
  interval?: number;

  /**
   * Current active stat index (for controlled mode)
   */
  activeIndex?: number;

  /**
   * Index change handler (for controlled mode)
   */
  onIndexChange?: (index: number) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
