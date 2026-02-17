import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  setAuth: (
    user: AdminUser,
    accessToken: string,
    refreshToken?: string,
    rememberMe?: boolean,
  ) => void;
  updateTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<AdminUser>) => void;
}

// JWT token-dan expire time-ı çıxart
const getTokenExpiry = (token: string): number | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? payload.exp * 1000 : null; // milliseconds
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      tokenExpiresAt: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken, rememberMe = false) =>
        set({
          user,
          accessToken,
          refreshToken: refreshToken || null,
          rememberMe,
          tokenExpiresAt: getTokenExpiry(accessToken),
          isAuthenticated: true,
        }),
      updateTokens: (accessToken, refreshToken) =>
        set((state) => ({
          accessToken,
          refreshToken: refreshToken || state.refreshToken,
          tokenExpiresAt: getTokenExpiry(accessToken),
        })),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          rememberMe: false,
          tokenExpiresAt: null,
          isAuthenticated: false,
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "puppy-admin-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        rememberMe: state.rememberMe,
        tokenExpiresAt: state.tokenExpiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Helper to check if user has specific role
export const hasRole = (user: AdminUser | null, role: string): boolean => {
  return user?.roles?.includes(role) ?? false;
};

// Helper to check if user is super admin
export const isSuperAdmin = (user: AdminUser | null): boolean => {
  return hasRole(user, "SuperAdmin");
};

// Helper to get display name for greeting
export const getGreetingName = (user: AdminUser | null): string => {
  if (!user) return "Admin";
  if (hasRole(user, "SuperAdmin")) return "Super Admin";
  if (hasRole(user, "Admin")) return "Admin";
  if (user.roles?.some((r) => r.includes("21"))) return "21st Degree";
  return user.firstName || user.userName || "Admin";
};
