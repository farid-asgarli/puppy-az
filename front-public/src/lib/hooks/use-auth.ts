'use client';

import { createContext, useContext, createElement, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { checkAuthAction, getProfileAction, refreshTokenAction } from '@/lib/auth/actions';
import type { UserProfileDto } from '@/lib/api/types/auth.types';
import { JwtUtils } from '@/lib/auth/jwt-utils';
import { TOKEN_EXPIRY_BUFFER_SECONDS } from '@/lib/auth/constants';

/**
 * Auth state for client components
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfileDto | null;
  loading: boolean;
}

/**
 * Auth context value
 */
interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserProfileDto | null;
  loading: boolean;
  refetch: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Props for AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode;
  initialAuth?: {
    isAuthenticated: boolean;
    user: UserProfileDto | null;
  };
}

/**
 * Provider component that manages auth state globally
 *
 * MUST wrap this at your app root to share auth state across all components.
 * This prevents each component from making separate auth API calls.
 *
 * Usage:
 * ```tsx
 * // In layout.tsx (with SSR)
 * const isAuth = await checkAuthAction();
 * const profileResult = isAuth ? await getProfileAction() : null;
 * <AuthProvider initialAuth={{ isAuthenticated: isAuth, user: profileResult?.data || null }}>
 *   <YourApp />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children, initialAuth }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: initialAuth?.isAuthenticated ?? false,
    user: initialAuth?.user ?? null,
    loading: !initialAuth, // Only show loading if no initial data
  });

  // Track refresh interval to clean up on unmount
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAuthState = useCallback(async () => {
    try {
      const isAuth = await checkAuthAction();

      if (isAuth) {
        // Fetch user profile if authenticated
        const profileResult = await getProfileAction();

        setState({
          isAuthenticated: true,
          user: profileResult.success ? profileResult.data : null,
          loading: false,
        });
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAuthState();
  }, [fetchAuthState]);

  const getToken = useCallback(async () => {
    // Import dynamically to avoid bundling server code in client
    const { getAccessTokenAction } = await import('@/lib/auth/actions');
    return getAccessTokenAction();
  }, []);

  /**
   * Check if access token needs refresh and refresh it proactively
   * This prevents the middleware from catching expired tokens and logging users out
   */
  const checkAndRefreshToken = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        // No token - user is not authenticated
        return false;
      }

      // Check if token is expired or will expire soon
      const isExpired = JwtUtils.isExpired(token, TOKEN_EXPIRY_BUFFER_SECONDS);

      if (isExpired) {
        // Token is expired or about to expire - refresh it
        console.log('[Auth] Token expiring soon, refreshing...');
        const result = await refreshTokenAction();

        if (result.success) {
          console.log('[Auth] Token refreshed successfully');
          // Refetch auth state to get updated user info
          await fetchAuthState();
          return true;
        } else {
          console.log('[Auth] Token refresh failed, user logged out');
          // Refresh failed - clear state
          setState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('[Auth] Token check failed:', error);
      return false;
    }
  }, [getToken, fetchAuthState]);

  useEffect(() => {
    // Skip fetch if we have initial data from SSR
    if (initialAuth) {
      return;
    }

    let mounted = true;

    const checkAuth = async () => {
      await fetchAuthState();
      if (!mounted) return;
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [initialAuth, fetchAuthState]);

  // // Proactive token refresh - check every minute
  // useEffect(() => {
  //   // Only set up refresh interval if user is authenticated
  //   if (!state.isAuthenticated) {
  //     // Clear interval if it exists
  //     if (refreshIntervalRef.current) {
  //       clearInterval(refreshIntervalRef.current);
  //       refreshIntervalRef.current = null;
  //     }
  //     return;
  //   }

  //   // Check immediately on mount
  //   checkAndRefreshToken();

  //   // Then check every minute (60 seconds)
  //   // This is much less than the 30-second buffer, so we'll catch tokens before they expire
  //   refreshIntervalRef.current = setInterval(() => {
  //     checkAndRefreshToken();
  //   }, 60 * 1000);

  //   return () => {
  //     if (refreshIntervalRef.current) {
  //       clearInterval(refreshIntervalRef.current);
  //       refreshIntervalRef.current = null;
  //     }
  //   };
  // }, [state.isAuthenticated, checkAndRefreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      loading: state.loading,
      refetch,
      getToken,
    }),
    [state.isAuthenticated, state.user, state.loading, refetch, getToken]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

/**
 * Hook to access full auth state (MUST be used inside AuthProvider)
 *
 * Returns authenticated user profile + auth status + token getter.
 * Use this when you need user details or need to make authenticated API calls.
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, user, loading, getToken } = useAuth();
 *
 * if (loading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <LoginPrompt />;
 *
 * // Get token for API calls
 * const token = await getToken();
 * const result = await apiService.someCall(token);
 *
 * return <div>Welcome, {user?.firstName}!</div>;
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider. Wrap your app root with <AuthProvider>.');
  }

  return context;
}

/**
 * Lightweight hook that only returns auth status (MUST be used inside AuthProvider)
 *
 * Use this when you only need to know if user is authenticated,
 * without needing the full user profile.
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, loading } = useAuthCheck();
 * ```
 */
export function useAuthCheck(): Pick<AuthContextValue, 'isAuthenticated' | 'loading'> {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthCheck must be used within AuthProvider. Wrap your app root with <AuthProvider>.');
  }

  return {
    isAuthenticated: context.isAuthenticated,
    loading: context.loading,
  };
}

/**
 * Hook for user profile only (MUST be used inside AuthProvider)
 *
 * Assumes user is authenticated. Use this in protected routes
 * where you know the user is already logged in.
 *
 * Usage:
 * ```tsx
 * const { user, loading } = useUserProfile();
 * ```
 */
export function useUserProfile(): Pick<AuthContextValue, 'user' | 'loading'> {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useUserProfile must be used within AuthProvider. Wrap your app root with <AuthProvider>.');
  }

  return {
    user: context.user,
    loading: context.loading,
  };
}
