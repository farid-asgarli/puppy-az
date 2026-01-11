import { ReactNode } from 'react';

/**
 * Base props shared across all form field components
 */
export interface BaseFormFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Helper text shown below the field
   */
  helperText?: string;

  /**
   * Error message (field will show error state if provided)
   */
  errorText?: string;

  /**
   * Success message (field will show success state if provided)
   */
  successText?: string;

  /**
   * Whether the field is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * HTML id for the input (auto-generated if not provided)
   */
  id?: string;
}

/**
 * Props for TextField component
 */
export interface TextFieldProps extends BaseFormFieldProps {
  /**
   * Current value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Input type
   * @default 'text'
   */
  type?: 'text' | 'email' | 'tel' | 'url';

  /**
   * Maximum character length
   */
  maxLength?: number;

  /**
   * Whether to show character counter
   * @default false (true if maxLength is provided)
   */
  showCharCount?: boolean;

  /**
   * Prefix content (e.g., currency symbol)
   */
  prefix?: ReactNode;

  /**
   * Suffix content (e.g., unit)
   */
  suffix?: ReactNode;
}

/**
 * Props for TextareaField component
 */
export interface TextareaFieldProps extends BaseFormFieldProps {
  /**
   * Current value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Number of visible text rows
   * @default 4
   */
  rows?: number;

  /**
   * Maximum character length
   */
  maxLength?: number;

  /**
   * Whether to show character counter
   * @default false (true if maxLength is provided)
   */
  showCharCount?: boolean;

  /**
   * Minimum character length for validation
   */
  minLength?: number;

  /**
   * Whether to allow resizing
   * @default false
   */
  resizable?: boolean;
}

/**
 * Props for NumberField component
 */
export interface NumberFieldProps extends BaseFormFieldProps {
  /**
   * Current value
   */
  value: number | null;

  /**
   * Change handler
   */
  onChange: (value: number | null) => void;

  /**
   * Minimum value
   */
  min?: number;

  /**
   * Maximum value
   */
  max?: number;

  /**
   * Step increment
   * @default 1
   */
  step?: number;

  /**
   * Prefix content (e.g., currency symbol)
   */
  prefix?: ReactNode;

  /**
   * Suffix content (e.g., unit like 'kg')
   */
  suffix?: ReactNode;

  /**
   * Number of decimal places to show
   */
  decimals?: number;
}
