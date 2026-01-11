/**
 * Clipboard Utility
 *
 * Provides robust clipboard functionality with fallback support for browsers
 * that don't support the Clipboard API.
 *
 * Primary method: navigator.clipboard.writeText (modern browsers)
 * Fallback method: textarea copy/execCommand (legacy browsers)
 */

/**
 * Copy text to clipboard with fallback support
 *
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Method 1: Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('Clipboard API failed, trying fallback method:', error);
      // Continue to fallback method
    }
  }

  // Method 2: Fallback using textarea and execCommand
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback method for copying to clipboard using textarea
 * Works in older browsers and non-secure contexts
 *
 * @param text - The text to copy to clipboard
 * @returns true if successful, false otherwise
 */
function fallbackCopyToClipboard(text: string): boolean {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Make it invisible and not interactive
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  textarea.setAttribute('readonly', '');

  // Add to DOM
  document.body.appendChild(textarea);

  try {
    // Select the text
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    // Try to copy using execCommand (legacy method)
    const successful = document.execCommand('copy');

    // Clean up
    document.body.removeChild(textarea);

    return successful;
  } catch (error) {
    console.error('Fallback clipboard copy failed:', error);

    // Clean up even if failed
    if (document.body.contains(textarea)) {
      document.body.removeChild(textarea);
    }

    return false;
  }
}

/**
 * Check if the Clipboard API is available
 *
 * @returns true if Clipboard API is supported, false otherwise
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}
