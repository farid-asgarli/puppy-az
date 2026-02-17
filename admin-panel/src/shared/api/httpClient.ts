import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/shared/stores/authStore";
import { endpoints } from "./endpoints";

// API Error type
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
}

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

// Refresh token function
const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken, rememberMe, updateTokens, logout } =
    useAuthStore.getState();

  if (!refreshToken || !rememberMe) {
    return null;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || "/api"}${endpoints.auth.refreshToken}`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    updateTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch {
    logout();
    return null;
  }
};

// Token refresh scheduler
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export const scheduleTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const { tokenExpiresAt, rememberMe, isAuthenticated } =
    useAuthStore.getState();

  if (!tokenExpiresAt || !rememberMe || !isAuthenticated) {
    return;
  }

  // Refresh 2 minutes before expiry
  const refreshTime = tokenExpiresAt - Date.now() - 2 * 60 * 1000;

  if (refreshTime > 0) {
    refreshTimer = setTimeout(async () => {
      const newToken = await refreshAccessToken();
      if (newToken) {
        scheduleTokenRefresh(); // Schedule next refresh
      }
    }, refreshTime);
  } else if (tokenExpiresAt > Date.now()) {
    // Token is about to expire, refresh immediately
    refreshAccessToken().then((newToken) => {
      if (newToken) {
        scheduleTokenRefresh();
      }
    });
  }
};

// Create axios instance
const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005/api",
    timeout: 30000,
  });

  // Request interceptor - attach auth token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add accept-language header based on current i18n language
      const lang = localStorage.getItem("i18nextLng") || "en";
      config.headers["Accept-Language"] = lang;

      // Set Content-Type based on data type
      if (config.data instanceof FormData) {
        // Remove any Content-Type so browser sets multipart/form-data with correct boundary
        config.headers["Content-Type"] = undefined;
      } else {
        // Default to JSON for non-FormData requests
        if (!config.headers["Content-Type"]) {
          config.headers["Content-Type"] = "application/json";
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor - handle errors with token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (
      error: AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>,
    ) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      const normalizedError = normalizeError(error);

      // Handle 401 - Try to refresh token if rememberMe is enabled
      if (error.response?.status === 401 && !originalRequest._retry) {
        const { rememberMe, refreshToken } = useAuthStore.getState();

        // If rememberMe and we have refresh token, try to refresh
        if (rememberMe && refreshToken) {
          if (isRefreshing) {
            // Queue this request while refresh is in progress
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(instance(originalRequest));
                },
                reject: (err: unknown) => {
                  reject(err);
                },
              });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();

            if (newToken) {
              processQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance(originalRequest);
            } else {
              processQueue(normalizedError, null);
              // Redirect to login
              if (window.location.pathname !== "/login") {
                window.location.href = "/login?session=expired";
              }
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
            if (window.location.pathname !== "/login") {
              window.location.href = "/login?session=expired";
            }
          } finally {
            isRefreshing = false;
          }
        } else {
          // No rememberMe or no refresh token - logout
          const { logout } = useAuthStore.getState();
          logout();

          if (window.location.pathname !== "/login") {
            window.location.href = "/login?session=expired";
          }
        }
      }

      return Promise.reject(normalizedError);
    },
  );

  return instance;
};

// Normalize backend errors to consistent ApiError format
const normalizeError = (
  error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>,
): ApiError => {
  if (error.response) {
    const { status, data } = error.response;

    // Handle validation errors (400)
    if (status === 400 && data?.errors) {
      return {
        message: "Validation error",
        code: "VALIDATION_ERROR",
        status,
        details: data.errors,
      };
    }

    // Handle unauthorized (401)
    if (status === 401) {
      return {
        message: data?.message || "Unauthorized. Please login again.",
        code: "UNAUTHORIZED",
        status,
      };
    }

    // Handle forbidden (403)
    if (status === 403) {
      return {
        message:
          data?.message || "You do not have permission to perform this action.",
        code: "FORBIDDEN",
        status,
      };
    }

    // Handle not found (404)
    if (status === 404) {
      return {
        message: data?.message || "Resource not found.",
        code: "NOT_FOUND",
        status,
      };
    }

    // Handle server errors (5xx)
    if (status >= 500) {
      return {
        message: "Server error. Please try again later.",
        code: "SERVER_ERROR",
        status,
      };
    }

    // Generic error
    return {
      message: data?.message || "An error occurred.",
      code: "UNKNOWN_ERROR",
      status,
    };
  }

  // Network error
  if (error.code === "ERR_NETWORK") {
    return {
      message: "Network error. Please check your connection.",
      code: "NETWORK_ERROR",
      status: 0,
    };
  }

  // Timeout
  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timed out. Please try again.",
      code: "TIMEOUT",
      status: 0,
    };
  }

  // Fallback
  return {
    message: error.message || "An unexpected error occurred.",
    code: "UNKNOWN_ERROR",
    status: 0,
  };
};

// Create singleton instance
export const httpClient = createHttpClient();

// Type-safe request helpers
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.delete<T>(url, config).then((res) => res.data),
};

// Helper to check if error is ApiError
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error &&
    "status" in error
  );
};

// Helper to get error message
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};
