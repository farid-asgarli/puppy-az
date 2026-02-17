import { useEffect } from "react";
import { useAuthStore } from "@/shared/stores/authStore";
import { scheduleTokenRefresh } from "@/shared/api/httpClient";

/**
 * Hook to manage automatic token refresh.
 * Should be used at the app root level.
 */
export function useTokenRefresh() {
  const { isAuthenticated, rememberMe } = useAuthStore();

  useEffect(() => {
    // Schedule token refresh when app loads if authenticated and rememberMe is enabled
    if (isAuthenticated && rememberMe) {
      scheduleTokenRefresh();
    }
  }, [isAuthenticated, rememberMe]);
}
