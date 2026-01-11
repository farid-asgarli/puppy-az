import type { UseFormRegisterReturn } from 'react-hook-form';

export type AuthFormFieldType = 'text' | 'email' | 'password' | 'tel';

export interface AuthFormFieldProps {
  /**
   * Input field type
   */
  type: AuthFormFieldType;

  /**
   * Field label text
   */
  label: string;

  /**
   * Icon component to display on the left
   */
  icon: React.ComponentType<{ size: number; className?: string }>;

  /**
   * Placeholder text
   */
  placeholder: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether the field is disabled
   */
  disabled?: boolean;

  /**
   * Show password toggle button (only for password type)
   */
  showPasswordToggle?: boolean;

  /**
   * Input value (controlled mode)
   */
  value?: string;

  /**
   * Change handler (controlled mode)
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * React Hook Form register props (uncontrolled mode)
   */
  registerProps?: UseFormRegisterReturn;

  /**
   * HTML input id attribute
   */
  id?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom input props to pass through
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
