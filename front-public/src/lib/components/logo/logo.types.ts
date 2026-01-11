export interface LogoProps {
  /**
   * Link destination when logo is clicked
   * @default '/'
   */
  href?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show the title and tagline text
   * @default true
   */
  showTitle?: boolean;
  /** Whether to show the tagline text
   * @default true
   */
  showTagline?: boolean;
}
