import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  District,
  DistrictCreateRequest,
  DistrictUpdateRequest,
  PaginatedResponse,
  PaginatedRequest,
} from "@/shared/api/types";
import { App } from "antd";
import { useTranslation } from "react-i18next";

// Query keys
export const districtsKeys = {
  all: ["districts"] as const,
  lists: () => [...districtsKeys.all, "list"] as const,
  list: (filters: PaginatedRequest & { cityId?: number }) =>
    [...districtsKeys.lists(), filters] as const,
  details: () => [...districtsKeys.all, "detail"] as const,
  detail: (id: number) => [...districtsKeys.details(), id] as const,
  byCity: (cityId: number) => [...districtsKeys.all, "byCity", cityId] as const,
};

// Get districts list (admin, paginated)
export function useDistricts(
  filters: PaginatedRequest & { search?: string; cityId?: number },
) {
  return useQuery({
    queryKey: districtsKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<District>>(endpoints.districts.list, {
        params: filters,
      }),
  });
}

// Get districts by city (for dropdowns)
export function useDistrictsByCity(cityId: number | undefined) {
  return useQuery({
    queryKey: districtsKeys.byCity(cityId!),
    queryFn: () =>
      api.get<{ id: number; name: string; cityId: number }[]>(
        endpoints.districts.byCity(cityId!),
      ),
    enabled: !!cityId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get single district
export function useDistrict(id: number | undefined) {
  return useQuery({
    queryKey: districtsKeys.detail(id!),
    queryFn: () => api.get<District>(endpoints.districts.byId(id!)),
    enabled: !!id,
  });
}

// Create district
export function useCreateDistrict() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: DistrictCreateRequest) =>
      api.post<{ id: number; alreadyExists?: boolean }>(
        endpoints.districts.create,
        data,
      ),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: districtsKeys.all });
      if (_data.alreadyExists) {
        message.info(t("districts.alreadyExists", "Bu rayon artıq mövcuddur"));
      } else {
        message.success(t("districts.createSuccess"));
      }
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Update district
export function useUpdateDistrict() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DistrictUpdateRequest }) =>
      api.put<District>(endpoints.districts.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: districtsKeys.all });
      message.success(t("districts.updateSuccess"));
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Delete district (soft delete)
export function useDeleteDistrict() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => api.delete(endpoints.districts.softDelete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: districtsKeys.all });
      message.success(t("districts.deleteSuccess"));
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: string } };
      const errorMessage = axiosError.response?.data || t("error.generic");
      message.error(errorMessage);
    },
  });
}
