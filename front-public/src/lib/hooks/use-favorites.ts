"use client";

import {
  createContext,
  useContext,
  createElement,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "./use-auth";
import {
  addFavoriteAdAction,
  removeFavoriteAdAction,
  syncFavoritesAction,
} from "@/lib/auth/actions";
import {
  getLocalFavorites,
  setLocalFavorites,
  addLocalFavorite,
  removeLocalFavorite,
  clearLocalFavorites,
} from "@/lib/utils/local-storage-favorites";

/**
 * Favorites context value
 */
interface FavoritesContextValue {
  favorites: Set<number>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
  createToggleHandler: (id: number) => (e?: React.MouseEvent) => Promise<void>;
  syncFavoritesFromBackend: (ids: number[]) => void;
  loading: boolean;
  syncing: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Props for FavoritesProvider
 */
interface FavoritesProviderProps {
  children: ReactNode;
  initialFavorites?: number[]; // SSR-provided favorites for authenticated users
}

/**
 * Provider component that manages favorites state globally
 *
 * For authenticated users: Syncs with backend and localStorage
 * For unauthenticated users: Uses localStorage only
 *
 * MUST wrap this at your app root to share favorites state across all components.
 *
 * Usage:
 * ```tsx
 * // In layout.tsx (with SSR)
 * const favIds = await getFavoriteAdIdsAction();
 * <FavoritesProvider initialFavorites={favIds.success ? favIds.data : []}>
 *   <YourApp />
 * </FavoritesProvider>
 * ```
 */
export function FavoritesProvider({
  children,
  initialFavorites = [],
}: FavoritesProviderProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set(initialFavorites),
  );
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [hasSyncedLocalFavorites, setHasSyncedLocalFavorites] = useState(false);

  // Initialize favorites based on auth state
  useEffect(() => {
    if (authLoading) return;

    const initializeFavorites = async () => {
      setLoading(true);

      if (isAuthenticated) {
        // Use SSR-provided favorites for authenticated users
        setFavorites(new Set(initialFavorites));

        // Sync local favorites to backend if user just logged in and hasn't synced yet
        if (!hasSyncedLocalFavorites) {
          const localFavs = getLocalFavorites();

          if (localFavs.length > 0) {
            // Filter out favorites that are already on the server
            const favsToSync = localFavs.filter(
              (id) => !initialFavorites.includes(id),
            );

            if (favsToSync.length > 0) {
              setSyncing(true);
              try {
                await syncFavoritesAction(favsToSync);
                // Add synced favorites to current state
                setFavorites((prev) => new Set([...prev, ...favsToSync]));
              } catch (error) {
                console.error("Failed to sync local favorites:", error);
              } finally {
                setSyncing(false);
              }
            }

            // Clear local storage after sync
            clearLocalFavorites();
          }

          setHasSyncedLocalFavorites(true);
        }
      } else {
        // Use localStorage for unauthenticated users
        const localFavs = getLocalFavorites();
        setFavorites(new Set(localFavs));
      }

      setLoading(false);
    };

    initializeFavorites();
  }, [isAuthenticated, authLoading, initialFavorites, hasSyncedLocalFavorites]);

  // Persist favorites to localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && !authLoading && !loading) {
      setLocalFavorites(Array.from(favorites));
    }
  }, [favorites, isAuthenticated, authLoading, loading]);

  /**
   * Check if an ad is favorited
   */
  const isFavorite = useCallback(
    (id: number): boolean => {
      return favorites.has(id);
    },
    [favorites],
  );

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback(
    async (id: number) => {
      const currentlyFavorited = favorites.has(id);

      // Optimistic update
      setFavorites((prev) => {
        const next = new Set(prev);
        if (currentlyFavorited) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });

      try {
        if (isAuthenticated) {
          // Sync with backend
          if (currentlyFavorited) {
            await removeFavoriteAdAction(id);
          } else {
            await addFavoriteAdAction([id]);
          }
        } else {
          // Update localStorage
          if (currentlyFavorited) {
            removeLocalFavorite(id);
          } else {
            addLocalFavorite(id);
          }
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);

        // Rollback on error
        setFavorites((prev) => {
          const next = new Set(prev);
          if (currentlyFavorited) {
            next.add(id);
          } else {
            next.delete(id);
          }
          return next;
        });
      }
    },
    [favorites, isAuthenticated],
  );

  /**
   * Create a toggle handler for a specific ID (useful for components)
   */
  const createToggleHandler = useCallback(
    (id: number) => {
      return async (e?: React.MouseEvent) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        await toggleFavorite(id);
      };
    },
    [toggleFavorite],
  );

  /**
   * Sync favorites from backend response (adds missing IDs to local state)
   * Used when fetching favorite ads from backend to ensure UI is in sync
   */
  const syncFavoritesFromBackend = useCallback((ids: number[]) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      let hasChanges = false;
      ids.forEach((id) => {
        if (!next.has(id)) {
          next.add(id);
          hasChanges = true;
        }
      });
      return hasChanges ? next : prev;
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      createToggleHandler,
      syncFavoritesFromBackend,
      loading,
      syncing,
    }),
    [
      favorites,
      isFavorite,
      toggleFavorite,
      createToggleHandler,
      syncFavoritesFromBackend,
      loading,
      syncing,
    ],
  );

  return createElement(FavoritesContext.Provider, { value }, children);
}

/**
 * Hook to access favorites functionality (MUST be used inside FavoritesProvider)
 *
 * Usage:
 * ```tsx
 * const { isFavorite, toggleFavorite, createToggleHandler } = useFavorites();
 *
 * // Check if favorited
 * const isLiked = isFavorite(adId);
 *
 * // Toggle favorite
 * await toggleFavorite(adId);
 *
 * // Or create a handler
 * const handleToggle = createToggleHandler(adId);
 * <button onClick={handleToggle}>Like</button>
 * ```
 */
export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used within FavoritesProvider. Wrap your app root with <FavoritesProvider>.",
    );
  }

  return context;
}
