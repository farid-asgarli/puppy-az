/**
 * Phone number utility functions for Azerbaijan phone numbers
 */

/**
 * Format phone number for display
 * Converts +994055... to +994 55...
 * Removes leading 0 after country code
 *
 * @param phone - Phone number string
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(
  phone: string | undefined | null,
): string {
  if (!phone) return "";

  let formatted = phone.trim();

  // If starts with +994, format it properly
  if (formatted.startsWith("+994")) {
    const numberPart = formatted.substring(4); // Remove +994
    // Remove leading 0 if present (e.g., 055 -> 55)
    const cleanNumber = numberPart.startsWith("0")
      ? numberPart.substring(1)
      : numberPart;
    // Add space after country code for display
    return `+994 ${cleanNumber}`;
  }

  // If starts with 0, remove it for display purposes
  if (formatted.startsWith("0")) {
    return formatted.substring(1);
  }

  return formatted;
}

/**
 * Format phone number for input field (without country code prefix)
 * Removes +994 and leading 0 for use in input fields that already show +994
 *
 * @param phone - Phone number string
 * @returns Phone number without country code prefix
 */
export function formatPhoneForInput(phone: string | undefined | null): string {
  if (!phone) return "";

  let formatted = phone.replace("+994", "").trim();

  // Remove leading 0 if present (e.g., 055 -> 55)
  if (formatted.startsWith("0")) {
    formatted = formatted.substring(1);
  }

  return formatted;
}

/**
 * Format phone number for storage/API calls
 * Ensures phone number is in +994XXXXXXXXX format
 *
 * @param phone - Phone number string (may or may not have +994)
 * @returns Phone number in +994XXXXXXXXX format
 */
export function formatPhoneForStorage(
  phone: string | undefined | null,
): string {
  if (!phone) return "";

  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // If already starts with +994, return as is
  if (cleaned.startsWith("+994")) {
    return cleaned;
  }

  // If starts with 994 (without +), add +
  if (cleaned.startsWith("994")) {
    return `+${cleaned}`;
  }

  // If starts with 0, remove it and add +994
  if (cleaned.startsWith("0")) {
    return `+994${cleaned.substring(1)}`;
  }

  // Otherwise just add +994
  return `+994${cleaned}`;
}
