import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  BreedSuggestion,
  ApproveBreedSuggestionRequest,
  RejectBreedSuggestionRequest,
  PaginatedResponse,
} from "@/shared/api/types";
import { App } from "antd";
import { useTranslation } from "react-i18next";
import { breedsKeys } from "../../breeds/api/breedsApi";

// Query keys
export const breedSuggestionsKeys = {
  all: ["breedSuggestions"] as const,
  lists: () => [...breedSuggestionsKeys.all, "list"] as const,
  list: (params?: { petCategoryId?: number; status?: number }) =>
    [...breedSuggestionsKeys.lists(), params] as const,
};

interface SuggestionsListParams {
  petCategoryId?: number;
  status?: number;
  page?: number;
  pageSize?: number;
}

// Get all breed suggestions with optional filtering
export function useBreedSuggestions(params?: SuggestionsListParams) {
  return useQuery({
    queryKey: breedSuggestionsKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.petCategoryId) {
        queryParams.append("petCategoryId", params.petCategoryId.toString());
      }
      if (params?.status !== undefined) {
        queryParams.append("status", params.status.toString());
      }
      if (params?.page) {
        queryParams.append("pagination.number", params.page.toString());
      }
      if (params?.pageSize) {
        queryParams.append("pagination.size", params.pageSize.toString());
      }

      const url = queryParams.toString()
        ? `${endpoints.breedSuggestions.list}?${queryParams.toString()}`
        : endpoints.breedSuggestions.list;

      const response = await api.get<
        PaginatedResponse<BreedSuggestion> | BreedSuggestion[]
      >(url);

      // Handle both array and paginated response formats
      if (Array.isArray(response)) {
        return { items: response, totalCount: response.length };
      }
      if (response && typeof response === "object" && "items" in response) {
        return {
          items: response.items,
          totalCount: response.totalCount,
        };
      }
      return { items: [], totalCount: 0 };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Approve a breed suggestion
export function useApproveBreedSuggestion() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: ApproveBreedSuggestionRequest) =>
      api.post<number>(
        endpoints.breedSuggestions.approve(data.suggestionId),
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: breedSuggestionsKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: breedsKeys.all });
      message.success(
        t(
          "breedSuggestions.approveSuccess",
          "Təklif qəbul edildi və cins yaradıldı",
        ),
      );
    },
    onError: (error: Error) => {
      message.error(error.message || t("error.generic"));
    },
  });
}

// Reject a breed suggestion
export function useRejectBreedSuggestion() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: RejectBreedSuggestionRequest) =>
      api.post<void>(
        endpoints.breedSuggestions.reject(data.suggestionId),
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: breedSuggestionsKeys.all,
      });
      message.success(
        t("breedSuggestions.rejectSuccess", "Təklif rədd edildi"),
      );
    },
    onError: (error: Error) => {
      message.error(error.message || t("error.generic"));
    },
  });
}
