import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  PetAdTypeListItem,
  PetAdTypeCreateRequest,
  PetAdTypeUpdateRequest,
} from "@/shared/api/types";
import { App } from "antd";
import { useTranslation } from "react-i18next";

// Query keys
export const listingTypesKeys = {
  all: ["listingTypes"] as const,
  lists: () => [...listingTypesKeys.all, "list"] as const,
  list: () => [...listingTypesKeys.lists()] as const,
  details: () => [...listingTypesKeys.all, "detail"] as const,
  detail: (id: number) => [...listingTypesKeys.details(), id] as const,
};

// Get all listing types
export function useListingTypes() {
  return useQuery({
    queryKey: listingTypesKeys.list(),
    queryFn: async () => {
      // Use admin endpoint to get all types (including inactive) with isActive field
      const response = await api.get<PetAdTypeListItem[]>(
        endpoints.listingTypes.list,
      );
      // Handle both array and { items: [], ... } response formats
      if (Array.isArray(response)) {
        return response;
      }
      // If response has an 'items' property (paginated response from admin), extract it
      if (response && typeof response === "object" && "items" in response) {
        return (response as { items: PetAdTypeListItem[] }).items;
      }
      // If response has a 'value' property (paginated response), extract it
      if (response && typeof response === "object" && "value" in response) {
        return (response as { value: PetAdTypeListItem[] }).value;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create listing type
export function useCreateListingType() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: PetAdTypeCreateRequest) =>
      api.post<PetAdTypeListItem>(endpoints.listingTypes.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingTypesKeys.all });
      message.success(
        t("listingTypes.createSuccess", "Elan növü uğurla yaradıldı"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Update listing type
export function useUpdateListingType() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PetAdTypeUpdateRequest }) =>
      api.put<PetAdTypeListItem>(endpoints.listingTypes.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingTypesKeys.all });
      message.success(
        t("listingTypes.updateSuccess", "Elan növü uğurla yeniləndi"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Toggle listing type active status (deactivate/activate)
export function useToggleListingTypeStatus() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PetAdTypeUpdateRequest }) =>
      api.put<PetAdTypeListItem>(endpoints.listingTypes.update(id), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: listingTypesKeys.all });
      const statusMessage = variables.data.isActive
        ? t("listingTypes.activateSuccess", "Elan növü aktivləşdirildi")
        : t("listingTypes.deactivateSuccess", "Elan növü deaktiv edildi");
      message.success(statusMessage);
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Delete listing type (soft delete)
export function useDeleteListingType() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(endpoints.listingTypes.softDelete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingTypesKeys.all });
      message.success(
        t("listingTypes.deleteSuccess", "Elan növü uğurla silindi"),
      );
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: string } };
      const errorMessage = axiosError.response?.data || t("error.generic");
      message.error(errorMessage);
    },
  });
}

// Restore listing type
export function useRestoreListingType() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => api.post(endpoints.listingTypes.restore(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingTypesKeys.all });
      message.success(
        t("listingTypes.restoreSuccess", "Elan növü uğurla bərpa edildi"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}
