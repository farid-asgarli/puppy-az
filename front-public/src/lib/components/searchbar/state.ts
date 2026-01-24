import { PetBreedDto, PetCategoryDetailedDto } from "@/lib/api";
import { LAYOUT, type ActiveField } from "./constants";

/**
 * Search bar state
 */
export interface SearchBarState {
  isExpanded: boolean;
  activeField: ActiveField;
  isDropdownVisible: boolean;
  dropdownPosition: {
    left: number;
    width: number;
  };
  selectedAdType: string | null;
  selectedCategory: PetCategoryDetailedDto | null;
  selectedBreed: PetBreedDto | null;
  inputAdType: string;
  inputCategory: string;
  inputBreed: string;
}

/**
 * Search bar actions
 */
export type SearchBarAction =
  | { type: "EXPAND" }
  | { type: "COLLAPSE" }
  | { type: "TOGGLE" }
  | { type: "SET_ACTIVE_FIELD"; payload: ActiveField }
  | { type: "SHOW_DROPDOWN"; payload: { left: number; width: number } }
  | { type: "HIDE_DROPDOWN" }
  | { type: "CLOSE_ALL" }
  | { type: "SET_AD_TYPE"; payload: string }
  | { type: "SET_CATEGORY"; payload: PetCategoryDetailedDto }
  | { type: "SET_BREED"; payload: PetBreedDto }
  | { type: "SET_INPUT_AD_TYPE"; payload: string }
  | { type: "SET_INPUT_CATEGORY"; payload: string }
  | { type: "SET_INPUT_BREED"; payload: string }
  | { type: "RESET_INPUT_AD_TYPE" }
  | { type: "RESET_INPUT_CATEGORY" }
  | { type: "RESET_INPUT_BREED" }
  | { type: "CLEAR_AD_TYPE" }
  | { type: "CLEAR_CATEGORY" }
  | { type: "CLEAR_BREED" }
  | {
      type: "SYNC_FROM_URL";
      payload: {
        selectedAdType: string | null;
        selectedCategory: PetCategoryDetailedDto | null;
        selectedBreed: PetBreedDto | null;
      };
    };

/**
 * Initial state factory - accepts initial values from URL
 */
export const createInitialState = (initialValues?: {
  selectedAdType?: string | null;
  selectedCategory?: PetCategoryDetailedDto | null;
  selectedBreed?: PetBreedDto | null;
}): SearchBarState => ({
  isExpanded: false,
  activeField: null,
  isDropdownVisible: false,
  dropdownPosition: { left: 0, width: LAYOUT.DROPDOWN_WIDTH },
  selectedAdType: initialValues?.selectedAdType ?? null,
  selectedCategory: initialValues?.selectedCategory ?? null,
  selectedBreed: initialValues?.selectedBreed ?? null,
  inputAdType: initialValues?.selectedAdType ?? "",
  inputCategory: initialValues?.selectedCategory?.title ?? "",
  inputBreed: initialValues?.selectedBreed?.title ?? "",
});

/**
 * Initial state (default)
 */
export const initialState: SearchBarState = createInitialState();

/**
 * Reducer function for search bar state management
 */
export function searchBarReducer(
  state: SearchBarState,
  action: SearchBarAction,
): SearchBarState {
  switch (action.type) {
    case "EXPAND":
      return { ...state, isExpanded: true };
    case "COLLAPSE":
      return {
        ...state,
        isExpanded: false,
        isDropdownVisible: false,
        activeField: null,
      };
    case "TOGGLE":
      return { ...state, isExpanded: !state.isExpanded };
    case "SET_ACTIVE_FIELD":
      return {
        ...state,
        activeField: action.payload,
        isExpanded: true,
      };
    case "SHOW_DROPDOWN":
      return {
        ...state,
        isDropdownVisible: true,
        dropdownPosition: action.payload,
      };
    case "HIDE_DROPDOWN":
      return {
        ...state,
        isDropdownVisible: false,
      };
    case "CLOSE_ALL":
      return {
        ...state,
        isDropdownVisible: false,
        activeField: null,
      };
    case "SET_AD_TYPE":
      return {
        ...state,
        selectedAdType: action.payload,
        inputAdType: action.payload,
        activeField: "category",
      };
    case "SET_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload,
        inputCategory: action.payload.title,
        activeField: "breed",
      };
    case "SET_BREED":
      return {
        ...state,
        selectedBreed: action.payload,
        inputBreed: action.payload.title,
        isDropdownVisible: false,
        activeField: null,
      };
    case "SET_INPUT_AD_TYPE":
      return {
        ...state,
        inputAdType: action.payload,
      };
    case "SET_INPUT_CATEGORY":
      return {
        ...state,
        inputCategory: action.payload,
      };
    case "SET_INPUT_BREED":
      return {
        ...state,
        inputBreed: action.payload,
      };
    case "RESET_INPUT_AD_TYPE":
      return {
        ...state,
        inputAdType: state.selectedAdType || "",
      };
    case "RESET_INPUT_CATEGORY":
      return {
        ...state,
        inputCategory: state.selectedCategory?.title || "",
      };
    case "RESET_INPUT_BREED":
      return {
        ...state,
        inputBreed: state.selectedBreed?.title || "",
      };
    case "CLEAR_AD_TYPE":
      return {
        ...state,
        selectedAdType: null,
        inputAdType: "",
      };
    case "CLEAR_CATEGORY":
      return {
        ...state,
        selectedCategory: null,
        inputCategory: "",
        selectedBreed: null,
        inputBreed: "",
      };
    case "CLEAR_BREED":
      return {
        ...state,
        selectedBreed: null,
        inputBreed: "",
      };
    case "SYNC_FROM_URL":
      return {
        ...state,
        selectedAdType: action.payload.selectedAdType,
        selectedCategory: action.payload.selectedCategory,
        selectedBreed: action.payload.selectedBreed,
        inputAdType: action.payload.selectedAdType || "",
        inputCategory: action.payload.selectedCategory?.title || "",
        inputBreed: action.payload.selectedBreed?.title || "",
      };
    default:
      return state;
  }
}
