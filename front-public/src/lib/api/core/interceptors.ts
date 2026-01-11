import type { RequestConfig, ApiResponse } from './base-client';

/**
 * Request context that flows through the interceptor chain
 *
 * Contains all contextual information needed for a request:
 * - Authentication token
 * - Localization (Accept-Language)
 * - Custom headers
 * - Request metadata
 */
export interface RequestContext {
  /**
   * Authentication token (JWT)
   * Auto-injected by auth interceptor if available
   */
  token?: string;

  /**
   * Locale for Accept-Language header (e.g., 'az', 'en', 'ru')
   * Auto-injected by locale interceptor
   */
  locale?: string;

  /**
   * Additional custom headers to merge
   */
  headers?: Record<string, string>;

  /**
   * Request metadata for logging/debugging
   */
  metadata?: {
    /**
     * Request identifier for tracing
     */
    requestId?: string;

    /**
     * Timestamp when request was initiated
     */
    startTime?: number;

    /**
     * Custom tags for logging/monitoring
     */
    tags?: string[];
  };
}

/**
 * Request interceptor
 *
 * Modifies the request config before it's sent
 * Can add headers, transform body, log, etc.
 */
export interface RequestInterceptor {
  /**
   * Process request before sending
   *
   * @param endpoint - API endpoint
   * @param config - Request configuration
   * @param context - Request context
   * @returns Modified config and context
   */
  onRequest(
    endpoint: string,
    config: RequestConfig,
    context: RequestContext
  ): Promise<{ config: RequestConfig; context: RequestContext }> | { config: RequestConfig; context: RequestContext };
}

/**
 * Response interceptor
 *
 * Processes the response after receiving it
 * Can transform data, log, handle errors, etc.
 */
export interface ResponseInterceptor {
  /**
   * Process response after receiving
   *
   * @param response - API response
   * @param context - Request context
   * @returns Modified response (or throw error to reject)
   */
  onResponse<T>(response: ApiResponse<T>, context: RequestContext): Promise<ApiResponse<T>> | ApiResponse<T>;

  /**
   * Handle error responses
   *
   * @param error - Error that occurred
   * @param context - Request context
   * @returns Can transform error or re-throw
   */
  onError?(error: Error, context: RequestContext): Promise<never> | never;
}

/**
 * Interceptor manager
 *
 * Manages the chain of request/response interceptors
 * Executes them in order for requests, reverse order for responses
 */
export class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  /**
   * Add a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Execute all request interceptors in sequence
   */
  async executeRequestInterceptors(
    endpoint: string,
    config: RequestConfig,
    context: RequestContext
  ): Promise<{ config: RequestConfig; context: RequestContext }> {
    let currentConfig = config;
    let currentContext = context;

    for (const interceptor of this.requestInterceptors) {
      const result = await interceptor.onRequest(endpoint, currentConfig, currentContext);
      currentConfig = result.config;
      currentContext = result.context;
    }

    return { config: currentConfig, context: currentContext };
  }

  /**
   * Execute all response interceptors in sequence
   */
  async executeResponseInterceptors<T>(response: ApiResponse<T>, context: RequestContext): Promise<ApiResponse<T>> {
    let currentResponse = response;

    for (const interceptor of this.responseInterceptors) {
      currentResponse = await interceptor.onResponse(currentResponse, context);
    }

    return currentResponse;
  }

  /**
   * Execute error handlers from response interceptors
   */
  async executeErrorInterceptors(error: Error, context: RequestContext): Promise<never> {
    // Execute error handlers in order
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onError) {
        await interceptor.onError(error, context);
      }
    }

    // If no interceptor handled it, re-throw
    throw error;
  }

  /**
   * Clear all interceptors
   */
  clear(): void {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }
}
