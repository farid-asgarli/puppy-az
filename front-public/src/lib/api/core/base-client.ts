import type { ProblemDetails } from '../types/auth.types';

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Custom error class for API errors
 * Wraps HTTP errors with RFC 7807 Problem Details support
 */
export class ApiError extends Error {
  constructor(public status: number, public statusText: string, public details?: ProblemDetails) {
    super(details?.detail || details?.title || statusText);
    this.name = 'ApiError';
  }
}

/**
 * HTTP request configuration
 */
export interface RequestConfig extends Omit<RequestInit, 'body'> {
  /**
   * Request body - will be automatically serialized to JSON
   */
  body?: unknown;

  /**
   * Additional headers to merge with defaults
   */
  headers?: HeadersInit;

  /**
   * Request timeout in milliseconds (overrides default)
   */
  timeout?: number;
}

/**
 * HTTP response wrapper with typed data
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Base HTTP client
 *
 * Low-level fetch abstraction focused purely on HTTP mechanics:
 * - Request/response serialization
 * - Error parsing (RFC 7807 support)
 * - Timeout handling
 * - Type safety
 *
 * Does NOT handle:
 * - Authentication tokens
 * - Localization headers
 * - Logging
 * (These are handled by the higher-level http-client with interceptors)
 */
export class BaseClient {
  constructor(private readonly baseUrl: string = API_CONFIG.BASE_URL) {}

  /**
   * Execute HTTP request with proper error handling
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { body, headers = {}, timeout = API_CONFIG.TIMEOUT, ...fetchOptions } = config;

    const url = `${this.baseUrl}${endpoint}`;

    // Build headers
    const isFormData = body instanceof FormData;
    const requestHeaders: HeadersInit = {
      ...headers,
      // Only set Content-Type for JSON, let browser set it for FormData
      ...(!isFormData && { 'Content-Type': 'application/json' }),
    };

    // Setup abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle error responses
      if (!response.ok) {
        throw await this.parseError(response);
      }

      // Parse response data
      const data = await this.parseResponse<T>(response);

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Re-throw ApiError as-is
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request Timeout');
      }

      // Handle network errors
      if (error instanceof Error) {
        throw new ApiError(0, error.message);
      }

      // Unknown error
      throw new ApiError(0, 'Unknown error occurred');
    }
  }

  /**
   * Parse successful response body
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    // Return empty object for non-JSON responses
    return {} as T;
  }

  /**
   * Parse error response with RFC 7807 Problem Details support
   */
  private async parseError(response: Response): Promise<ApiError> {
    let details: ProblemDetails | undefined;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json') || contentType?.includes('application/problem+json')) {
        details = await response.json();
      }
    } catch {
      // Failed to parse error body, continue with basic error
    }

    return new ApiError(response.status, response.statusText, details);
  }

  /**
   * Convenience method: GET request
   */
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * Convenience method: POST request
   */
  async post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * Convenience method: PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * Convenience method: PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * Convenience method: DELETE request
   */
  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}
