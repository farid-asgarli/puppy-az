import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  StaticSection,
  StaticSectionListItem,
  CreateStaticSectionRequest,
  UpdateStaticSectionRequest,
} from "@/shared/api/types";
import { App } from "antd";
import { useTranslation } from "react-i18next";

// Query keys
export const staticSectionsKeys = {
  all: ["staticSections"] as const,
  lists: () => [...staticSectionsKeys.all, "list"] as const,
  list: () => [...staticSectionsKeys.lists()] as const,
  details: () => [...staticSectionsKeys.all, "detail"] as const,
  detail: (id: number) => [...staticSectionsKeys.details(), id] as const,
};

// Get all static sections
export function useStaticSections() {
  return useQuery({
    queryKey: staticSectionsKeys.list(),
    queryFn: async () => {
      const response = await api.get<StaticSectionListItem[]>(
        endpoints.staticSections.list,
      );
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get static section by ID
export function useStaticSection(id: number | null) {
  return useQuery({
    queryKey: staticSectionsKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get<StaticSection>(
        endpoints.staticSections.byId(String(id)),
      );
      return response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// Create static section
export function useCreateStaticSection() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateStaticSectionRequest) =>
      api.post<number>(endpoints.staticSections.list, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staticSectionsKeys.all });
      message.success(
        t("staticSections.createSuccess", "Bölmə uğurla yaradıldı"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}

// Update static section
export function useUpdateStaticSection() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateStaticSectionRequest;
    }) => api.put(endpoints.staticSections.update(String(id)), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staticSectionsKeys.all });
      message.success(
        t("staticSections.saveSuccess", "Bölmə uğurla yadda saxlanıldı"),
      );
    },
    onError: () => {
      message.error(t("error.generic"));
    },
  });
}
