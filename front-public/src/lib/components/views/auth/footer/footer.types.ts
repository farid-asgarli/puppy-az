export interface AuthFooterProps {
  /**
   * Main message text (e.g., "Hesabınız yoxdur?")
   */
  message: string;

  /**
   * Link text (e.g., "Qeydiyyatdan keçin")
   */
  linkText: string;

  /**
   * Link destination URL
   */
  linkHref: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
