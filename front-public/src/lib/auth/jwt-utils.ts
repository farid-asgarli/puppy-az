/**
 * JWT Token utilities
 *
 * Shared utilities that work in both server and client environments.
 * No dependencies on server-only modules like 'next/headers'.
 */
export class JwtUtils {
  /**
   * Parse JWT payload without verification
   * Works in both Node.js and browser environments
   */
  static parsePayload(token: string): Record<string, any> | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      // Decode payload (Base64 URL encoded)
      // Support both Node.js and browser environments
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      let jsonPayload: string;
      if (typeof window === 'undefined') {
        // Node.js environment
        jsonPayload = Buffer.from(base64, 'base64').toString();
      } else {
        // Browser environment
        jsonPayload = atob(base64);
      }

      const payload = JSON.parse(jsonPayload);
      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Check if JWT token is expired
   * @param bufferSeconds - Optional buffer time in seconds before actual expiry (default: 30s)
   */
  static isExpired(token: string, bufferSeconds: number = 30): boolean {
    const payload = this.parsePayload(token);
    if (!payload || !payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    // Add buffer time to prevent edge cases where token expires during request
    return payload.exp < now + bufferSeconds;
  }

  /**
   * Get token expiration time
   */
  static getExpiration(token: string): Date | null {
    const payload = this.parsePayload(token);
    if (!payload || !payload.exp) return null;

    return new Date(payload.exp * 1000);
  }
}
