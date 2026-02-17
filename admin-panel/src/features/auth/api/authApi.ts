import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import { scheduleTokenRefresh } from "@/shared/api/httpClient";
import type {
  LoginRequest,
  LoginResponse,
  AdminUserResponse,
} from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/authStore";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import { useTranslation } from "react-i18next";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

// Login mutation with rememberMe support
export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (
      credentials: LoginRequest & { rememberMe?: boolean },
    ) => {
      const response = await api.post<LoginResponse>(endpoints.auth.login, {
        email: credentials.email,
        password: credentials.password,
      });
      return { ...response, rememberMe: credentials.rememberMe };
    },
    onSuccess: async (data) => {
      // Fetch user details after login
      const user = await api.get<AdminUserResponse>(endpoints.auth.me);

      setAuth(
        {
          id: user.id,
          userName: user.userName,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
        },
        data.accessToken,
        data.refreshToken,
        data.rememberMe,
      );

      // Schedule token refresh if rememberMe is enabled
      if (data.rememberMe) {
        scheduleTokenRefresh();
      }

      message.success(t("auth.loginSuccess") || "Login successful");
      navigate("/dashboard", { replace: true });
    },
    onError: () => {
      message.error(t("auth.invalidCredentials"));
    },
  });
}

// Logout mutation
export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post(endpoints.auth.logout);
      } catch {
        // Ignore logout errors
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
}

// Get current user
export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => api.get<AdminUserResponse>(endpoints.auth.me),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
