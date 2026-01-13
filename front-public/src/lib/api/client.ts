import type { ProblemDetails } from './types/auth.types';

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(public status: number, public statusText: string, public details?: ProblemDetails) {
    super(details?.detail || details?.title || statusText);
    this.name = 'ApiError';
  }
}

/**
 * Fetch options with auth token and locale
 */
interface FetchOptions extends RequestInit {
  token?: string;
  locale?: string;
}

/**
 * Base API client with fetch
 * Handles common concerns: auth headers, locale headers, error parsing, JSON serialization
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Build headers with optional authorization and locale
   */
  private buildHeaders(token?: string, locale?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (locale) {
      headers['Accept-Language'] = locale;
    }

    return headers;
  }

  /**
   * Parse error response
   */
  private async parseError(response: Response): Promise<ApiError> {
    let details: ProblemDetails | undefined;

    try {
      const contentType = response.headers.get('content-type');
      // Check for both application/json and application/problem+json (RFC 7807)
      if (contentType?.includes('application/json') || contentType?.includes('application/problem+json')) {
        details = await response.json();
      }
    } catch {
      // Failed to parse error body, ignore
    }

    return new ApiError(response.status, response.statusText, details);
  }

  /**
   * Generic request method
   */
  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(token);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: { ...headers, ...fetchOptions.headers },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.parseError(response);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      // Return empty object for non-JSON responses
      return {} as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request Timeout');
        }
        throw new ApiError(0, error.message);
      }

      throw new ApiError(0, 'Unknown error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      token,
    });
  }

  /**
   * POST request
   */
  async post<T, D = unknown>(endpoint: string, data?: D, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }

  /**
   * PUT request
   */
  async put<T, D = unknown>(endpoint: string, data?: D, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }

  /**
   * PATCH request
   */
  async patch<T, D = unknown>(endpoint: string, data?: D, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      token,
    });
  }
}

/**
 * Singleton API client instance
 */
export const apiClient = new ApiClient();
