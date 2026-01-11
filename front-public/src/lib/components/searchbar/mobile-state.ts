import { PetBreedDto, PetCategoryDetailedDto } from '@/lib/api';

/**
 * Mobile search bar state
 */
export interface MobileSearchBarState {
  isExpanded: boolean;
  activeSheet: 'ad-type' | 'category' | 'breed' | null;
  selectedAdType: string | null;
  selectedCategory: PetCategoryDetailedDto | null;
  selectedBreed: PetBreedDto | null;
}

/**
 * Mobile search bar actions
 */
export type MobileSearchBarAction =
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'OPEN_SHEET'; payload: 'ad-type' | 'category' | 'breed' }
  | { type: 'CLOSE_SHEET' }
  | { type: 'SET_AD_TYPE'; payload: string }
  | { type: 'SET_CATEGORY'; payload: PetCategoryDetailedDto }
  | { type: 'SET_BREED'; payload: PetBreedDto }
  | { type: 'CLEAR_AD_TYPE' }
  | { type: 'CLEAR_CATEGORY' }
  | { type: 'CLEAR_BREED' }
  | { type: 'CLEAR_ALL' };

/**
 * Initial state factory - accepts initial values from URL
 */
export const createInitialMobileState = (initialValues?: {
  selectedAdType?: string | null;
  selectedCategory?: PetCategoryDetailedDto | null;
  selectedBreed?: PetBreedDto | null;
}): MobileSearchBarState => ({
  isExpanded: false,
  activeSheet: null,
  selectedAdType: initialValues?.selectedAdType ?? null,
  selectedCategory: initialValues?.selectedCategory ?? null,
  selectedBreed: initialValues?.selectedBreed ?? null,
});

/**
 * Initial state (default)
 */
export const initialMobileState: MobileSearchBarState = createInitialMobileState();

/**
 * Reducer function for mobile search bar state management
 */
export function mobileSearchBarReducer(state: MobileSearchBarState, action: MobileSearchBarAction): MobileSearchBarState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, isExpanded: true };
    case 'CLOSE_MODAL':
      return {
        ...state,
        isExpanded: false,
        activeSheet: null,
      };
    case 'OPEN_SHEET':
      return { ...state, activeSheet: action.payload };
    case 'CLOSE_SHEET':
      return { ...state, activeSheet: null };
    case 'SET_AD_TYPE':
      return {
        ...state,
        selectedAdType: action.payload,
        activeSheet: null,
      };
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        selectedBreed: null, // Clear breed when category changes
        activeSheet: null,
      };
    case 'SET_BREED':
      return {
        ...state,
        selectedBreed: action.payload,
        activeSheet: null,
      };
    case 'CLEAR_AD_TYPE':
      return {
        ...state,
        selectedAdType: null,
      };
    case 'CLEAR_CATEGORY':
      return {
        ...state,
        selectedCategory: null,
        selectedBreed: null, // Clear breed when category is cleared
      };
    case 'CLEAR_BREED':
      return {
        ...state,
        selectedBreed: null,
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        selectedAdType: null,
        selectedCategory: null,
        selectedBreed: null,
      };
    default:
      return state;
  }
}
