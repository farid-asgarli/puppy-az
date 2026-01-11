export interface SectionHeaderAction {
  /**
   * Button label text
   */
  label: string;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Icon component to display in the button (optional)
   */
  icon?: React.ComponentType<{ size?: number; className?: string }>;

  /**
   * Button variant
   * @default 'secondary'
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'solid';
}

export type SectionHeaderAlign = 'left' | 'center' | 'right';

export type SectionHeaderLayout = 'stacked' | 'horizontal';

export interface SectionHeaderProps {
  /**
   * Section title text
   */
  title: string;

  /**
   * Optional subtitle/description text
   */
  subtitle?: string;

  /**
   * Optional action button configuration
   */
  action?: SectionHeaderAction;

  /**
   * Title level for accessibility
   * @default 'h2'
   */
  level?: 'h1' | 'h2' | 'h3';

  /**
   * Text alignment (for stacked layout)
   * @default 'center'
   */
  align?: SectionHeaderAlign;

  /**
   * Layout variant
   * - stacked: Vertical layout with centered/aligned text (about pages)
   * - horizontal: Horizontal layout with title/subtitle on left, action on right (detail pages)
   * @default 'stacked'
   */
  layout?: SectionHeaderLayout;

  /**
   * Title size variant (used in horizontal layout)
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}
