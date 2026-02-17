/**
 * Phone number utility functions for Azerbaijan phone numbers
 */

/**
 * Format phone number for display
 * Converts +994XXXXXXXXX to 0XX XXX XX XX format
 *
 * @param phone - Phone number string
 * @returns Formatted phone number for display (e.g. 055 555 55 55)
 */
export function formatPhoneForDisplay(
  phone: string | undefined | null,
): string {
  if (!phone) return "";

  let digits = phone.trim().replace(/[^\d]/g, "");

  // If starts with 994, remove country code
  if (digits.startsWith("994")) {
    digits = digits.substring(3);
  }

  // Ensure it starts with 0
  if (!digits.startsWith("0")) {
    digits = "0" + digits;
  }

  // Format as 0XX XXX XX XX
  if (digits.length === 10) {
    return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8, 10)}`;
  }

  // Fallback: return with leading 0
  return digits;
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
  const cleaned = phone.replace(/[^\d+]/g, "");

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
