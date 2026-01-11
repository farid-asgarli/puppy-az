import { httpClient, HttpClient } from './http-client';
import { RequestContext } from './interceptors';

/**
 * Base service class
 *
 * All API services should extend this class to:
 * - Access the HTTP client
 * - Build request contexts consistently
 * - Share common utility methods
 * - Maintain consistent patterns across services
 */
export abstract class BaseService {
  /**
   * HTTP client instance for making requests
   */
  protected readonly http: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.http = client;
  }

  /**
   * Create request context with token
   *
   * Helper method to build context for authenticated requests
   */
  protected withAuth(token: string, locale?: string): RequestContext {
    return {
      token,
      locale,
    };
  }

  /**
   * Create request context with locale only
   *
   * Helper method for public requests that need localization
   */
  protected withLocale(locale: string): RequestContext {
    return {
      locale,
    };
  }

  /**
   * Create empty request context
   *
   * For public requests without auth or locale
   */
  protected noContext(): RequestContext {
    return {};
  }

  /**
   * Build query string from object
   *
   * Utility for constructing URL query parameters
   */
  protected buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

    return filtered.length > 0 ? `?${filtered.join('&')}` : '';
  }
}
