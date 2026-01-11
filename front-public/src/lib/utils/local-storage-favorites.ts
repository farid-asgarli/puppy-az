/**
 * Local storage utilities for managing favorites when user is not authenticated
 */

const FAVORITES_KEY = 'puppy_favorites';

/**
 * Check if we're running in browser
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Get favorite IDs from localStorage
 */
export function getLocalFavorites(): number[] {
  if (!isBrowser) return [];

  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : [];
  } catch (error) {
    console.error('Failed to read favorites from localStorage:', error);
    return [];
  }
}

/**
 * Set favorite IDs in localStorage (replaces entire list)
 */
export function setLocalFavorites(ids: number[]): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Failed to write favorites to localStorage:', error);
  }
}

/**
 * Add a favorite ID to localStorage
 */
export function addLocalFavorite(id: number): void {
  if (!isBrowser) return;

  const current = getLocalFavorites();
  if (!current.includes(id)) {
    setLocalFavorites([...current, id]);
  }
}

/**
 * Remove a favorite ID from localStorage
 */
export function removeLocalFavorite(id: number): void {
  if (!isBrowser) return;

  const current = getLocalFavorites();
  setLocalFavorites(current.filter((favId) => favId !== id));
}

/**
 * Clear all favorites from localStorage
 */
export function clearLocalFavorites(): void {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Failed to clear favorites from localStorage:', error);
  }
}

/**
 * Check if an ID is in favorites
 */
export function isLocalFavorite(id: number): boolean {
  return getLocalFavorites().includes(id);
}
