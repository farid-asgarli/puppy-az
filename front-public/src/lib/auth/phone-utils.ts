/**
 * Phone number utilities for Azerbaijan phone numbers (+994)
 * Used across authentication forms
 */

/**
 * Formats Azerbaijani phone number as user types: XX XXX XX XX
 */
export function formatAzerbaijaniPhone(input: string): string {
  const value = input.replace(/\D/g, '');

  if (value.length <= 9) {
    if (value.length <= 2) return value;
    if (value.length <= 5) return `${value.slice(0, 2)} ${value.slice(2)}`;
    if (value.length <= 7) return `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
    return `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 7)} ${value.slice(7)}`;
  }

  return input;
}

/**
 * Validates if Azerbaijani phone number is complete (9 digits without spaces)
 */
export function isValidAzerbaijaniPhone(phoneNumber: string): boolean {
  const cleanPhone = phoneNumber.replace(/\s/g, '');
  return cleanPhone.length === 9;
}

/**
 * Gets clean phone number (removes spaces)
 */
export function getCleanPhone(phoneNumber: string): string {
  return phoneNumber.replace(/\s/g, '');
}

/**
 * Formats phone number for API with country code
 * @param phoneNumber - Formatted phone number (XX XXX XX XX)
 * @param includeCountryCode - Whether to include +994 prefix (default true)
 */
export function formatPhoneForApi(phoneNumber: string, includeCountryCode: boolean = false): string {
  const cleanPhone = getCleanPhone(phoneNumber);
  return includeCountryCode ? `+994${cleanPhone}` : `0${cleanPhone}`;
}
