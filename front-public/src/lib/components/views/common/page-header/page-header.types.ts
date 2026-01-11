export interface PageHeaderBackButton {
  /**
   * URL to navigate to
   */
  href: string;

  /**
   * Button label text
   * @default '← Geri'
   */
  label?: string;
}

export type PageHeaderMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export interface PageHeaderProps {
  /**
   * Page title
   */
  title: string;

  /**
   * Page subtitle/description
   */
  subtitle: string;

  /**
   * Optional action buttons/elements in header
   */
  actions?: React.ReactNode;

  /**
   * Maximum width constraint for the header content
   * @default 'md' (uses NarrowContainer)
   */
  maxWidth?: PageHeaderMaxWidth;

  /**
   * Additional CSS classes
   */
  className?: string;
}
