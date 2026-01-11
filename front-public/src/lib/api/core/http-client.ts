import { BaseClient, ApiResponse, RequestConfig, API_CONFIG } from './base-client';
import { InterceptorManager, RequestContext, RequestInterceptor, ResponseInterceptor } from './interceptors';

/**
 * Authentication interceptor
 * Automatically injects Bearer token into Authorization header
 */
export class AuthInterceptor implements RequestInterceptor {
  onRequest(endpoint: string, config: RequestConfig, context: RequestContext): { config: RequestConfig; context: RequestContext } {
    // Skip auth for public endpoints or if token explicitly not needed
    if (!context.token) {
      return { config, context };
    }

    // Inject Authorization header
    const headers = {
      ...config.headers,
      Authorization: `Bearer ${context.token}`,
    };

    return {
      config: { ...config, headers },
      context,
    };
  }
}

/**
 * Localization interceptor
 * Injects Accept-Language header for i18n support
 */
export class LocaleInterceptor implements RequestInterceptor {
  onRequest(endpoint: string, config: RequestConfig, context: RequestContext): { config: RequestConfig; context: RequestContext } {
    // Skip if no locale specified
    if (!context.locale) {
      return { config, context };
    }

    // Inject Accept-Language header
    const headers = {
      ...config.headers,
      'Accept-Language': context.locale,
    };

    return {
      config: { ...config, headers },
      context,
    };
  }
}

/**
 * Logging interceptor
 * Logs requests and responses for debugging
 */
export class LoggingInterceptor implements RequestInterceptor, ResponseInterceptor {
  constructor(private readonly enabled: boolean = process.env.NODE_ENV === 'development') {}

  onRequest(endpoint: string, config: RequestConfig, context: RequestContext): { config: RequestConfig; context: RequestContext } {
    if (!this.enabled) {
      return { config, context };
    }

    // Add request timestamp
    const enhancedContext: RequestContext = {
      ...context,
      metadata: {
        ...context.metadata,
        startTime: Date.now(),
        requestId: context.metadata?.requestId || this.generateRequestId(),
      },
    };

    console.log(`[HTTP] ${config.method || 'GET'} ${endpoint}`, {
      requestId: enhancedContext.metadata?.requestId,
      headers: config.headers,
      body: config.body,
    });

    return { config, context: enhancedContext };
  }

  onResponse<T>(response: ApiResponse<T>, context: RequestContext): ApiResponse<T> {
    if (!this.enabled) {
      return response;
    }

    const duration = context.metadata?.startTime ? Date.now() - context.metadata.startTime : 0;

    console.log(`[HTTP] Response ${response.status}`, {
      requestId: context.metadata?.requestId,
      duration: `${duration}ms`,
      status: response.status,
    });

    return response;
  }

  onError(error: Error, context: RequestContext): never {
    if (this.enabled) {
      const duration = context.metadata?.startTime ? Date.now() - context.metadata.startTime : 0;

      console.error(`[HTTP] Error`, {
        requestId: context.metadata?.requestId,
        duration: `${duration}ms`,
        error: error.message,
      });
    }

    throw error;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * HTTP Client with interceptor support
 *
 * High-level client that:
 * - Uses BaseClient for HTTP mechanics
 * - Applies interceptor chain (auth, locale, logging)
 * - Provides clean API for services
 * - Handles RequestContext properly
 */
export class HttpClient {
  private baseClient: BaseClient;
  private interceptorManager: InterceptorManager;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseClient = new BaseClient(baseUrl);
    this.interceptorManager = new InterceptorManager();

    // Register default interceptors
    this.setupDefaultInterceptors();
  }

  /**
   * Setup default interceptors (auth, locale, logging)
   */
  private setupDefaultInterceptors(): void {
    // Order matters: Auth first, then locale, then logging
    this.interceptorManager.addRequestInterceptor(new AuthInterceptor());
    this.interceptorManager.addRequestInterceptor(new LocaleInterceptor());

    const loggingInterceptor = new LoggingInterceptor();
    this.interceptorManager.addRequestInterceptor(loggingInterceptor);
    this.interceptorManager.addResponseInterceptor(loggingInterceptor);
  }

  /**
   * Add custom request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.interceptorManager.addRequestInterceptor(interceptor);
  }

  /**
   * Add custom response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.interceptorManager.addResponseInterceptor(interceptor);
  }

  /**
   * Execute HTTP request with interceptor chain
   */
  async request<T>(endpoint: string, config: RequestConfig = {}, context: RequestContext = {}): Promise<T> {
    try {
      // Execute request interceptors
      const { config: modifiedConfig, context: modifiedContext } = await this.interceptorManager.executeRequestInterceptors(
        endpoint,
        config,
        context
      );

      // Execute base HTTP request
      const response = await this.baseClient.request<T>(endpoint, modifiedConfig);

      // Execute response interceptors
      const modifiedResponse = await this.interceptorManager.executeResponseInterceptors(response, modifiedContext);

      // Return data only (not the full response wrapper)
      return modifiedResponse.data;
    } catch (error) {
      // Execute error interceptors
      await this.interceptorManager.executeErrorInterceptors(error as Error, context);

      // This line won't be reached, but TypeScript needs it
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, context?: RequestContext): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, context);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, context?: RequestContext): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body }, context);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, context?: RequestContext): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body }, context);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, context?: RequestContext): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body }, context);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, context?: RequestContext): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, context);
  }
}

/**
 * Singleton HTTP client instance
 * Used by all services
 */
export const httpClient = new HttpClient();
