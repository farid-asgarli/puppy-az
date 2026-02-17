import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  City,
  CityCreateRequest,
  CityUpdateRequest,
  PaginatedResponse,
  PaginatedRequest,
} from "@/shared/api/types";
import { App } from "antd";
import { useTranslation } from "react-i18next";

// Query keys
export const citiesKeys = {
  all: ["cities"] as const,
  lists: () => [...citiesKeys.all, "list"] as const,
  list: (filters: PaginatedRequest) =>
    [...citiesKeys.lists(), filters] as const,
  details: () => [...citiesKeys.all, "detail"] as const,
  detail: (id: number) => [...citiesKeys.details(), id] as const,
};

// Get cities list
export function useCities(filters: PaginatedRequest & { search?: string }) {
  return useQuery({
    queryKey: citiesKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<City>>(endpoints.cities.list, {
        params: filters,
      }),
  });
}

// Get all cities (for dropdowns)
export function useAllCities() {
  return useQuery({
    queryKey: [...citiesKeys.all, "all"],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<City>>(
        endpoints.cities.list,
        {
          params: { page: 1, pageSize: 200 },
        },
      );
      return res.items;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get single city
export function useCity(id: number | undefined) {
  return useQuery({
    queryKey: citiesKeys.detail(id!),
    queryFn: () => api.get<City>(endpoints.cities.byId(id!)),
    enabled: !!id,
  });
}

// Create city
export function useCreateCity() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CityCreateRequest) =>
      api.post<City>(endpoints.cities.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesKeys.all });
      message.success(t("cities.createSuccess"));
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Update city
export function useUpdateCity() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CityUpdateRequest }) =>
      api.put<City>(endpoints.cities.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesKeys.all });
      message.success(t("cities.updateSuccess"));
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Delete city (soft delete)
export function useDeleteCity() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => api.delete(endpoints.cities.softDelete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesKeys.all });
      message.success(t("cities.deleteSuccess"));
    },
    onError: (error: unknown) => {
      // Extract error message from API response
      const axiosError = error as { response?: { data?: string } };
      const errorMessage = axiosError.response?.data || t("error.generic");
      message.error(errorMessage);
    },
  });
}
