import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from "@/shared/api/types";
import { App } from "antd";
import { useTranslation } from "react-i18next";

// Query keys
export const categoriesKeys = {
  all: ["categories"] as const,
  lists: () => [...categoriesKeys.all, "list"] as const,
  list: () => [...categoriesKeys.lists()] as const,
  details: () => [...categoriesKeys.all, "detail"] as const,
  detail: (id: number) => [...categoriesKeys.details(), id] as const,
};

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: async () => {
      const response = await api.get<Category[]>(endpoints.categories.list);
      // Handle both array and paginated response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response && typeof response === "object" && "items" in response) {
        return (response as { items: Category[] }).items;
      }
      if (response && typeof response === "object" && "value" in response) {
        return (response as { value: Category[] }).value;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CategoryCreateRequest) =>
      api.post<Category>(endpoints.categories.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      message.success(
        t("categories.createSuccess", "Kateqoriya uğurla yaradıldı"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdateRequest }) =>
      api.put<Category>(endpoints.categories.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      message.success(
        t("categories.updateSuccess", "Kateqoriya uğurla yeniləndi"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Toggle category active status
export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdateRequest }) =>
      api.put<Category>(endpoints.categories.update(id), data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      const statusMessage = variables.data.isActive
        ? t("categories.activateSuccess", "Kateqoriya aktivləşdirildi")
        : t("categories.deactivateSuccess", "Kateqoriya deaktiv edildi");
      message.success(statusMessage);
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Delete category (soft delete)
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => api.delete(endpoints.categories.softDelete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      message.success(
        t("categories.deleteSuccess", "Kateqoriya uğurla silindi"),
      );
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: string } };
      const errorMessage = axiosError.response?.data || t("error.generic");
      message.error(errorMessage);
    },
  });
}

// Restore category
export function useRestoreCategory() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => api.post(endpoints.categories.restore(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      message.success(
        t("categories.restoreSuccess", "Kateqoriya uğurla bərpa edildi"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}
