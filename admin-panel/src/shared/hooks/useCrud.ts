import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { api, ApiError, getErrorMessage } from "@/shared/api";
import { App } from "antd";
import { useTranslation } from "react-i18next";
import type { PaginatedRequest, PaginatedResponse } from "@/shared/api/types";

interface UseCrudQueryOptions<
  TFilters extends PaginatedRequest = PaginatedRequest,
> {
  queryKey: QueryKey;
  endpoint: string;
  filters?: TFilters;
  enabled?: boolean;
}

interface UseCrudMutationsOptions {
  queryKey: QueryKey;
  endpoints: {
    create: string;
    update: (id: number | string) => string;
    delete: (id: number | string) => string;
  };
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
  };
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

// Generic hook for paginated list queries
export function useCrudList<
  T,
  TFilters extends PaginatedRequest = PaginatedRequest,
>({
  queryKey,
  endpoint,
  filters,
  enabled = true,
}: UseCrudQueryOptions<TFilters>) {
  return useQuery({
    queryKey: [...queryKey, filters],
    queryFn: () => api.post<PaginatedResponse<T>>(endpoint, filters),
    enabled,
  });
}

// Generic hook for fetching a single item
export function useCrudItem<T>(
  queryKey: QueryKey,
  endpoint: string,
  id: number | string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => api.get<T>(endpoint),
    enabled: enabled && !!id,
  });
}

// Generic hook for CRUD mutations
export function useCrudMutations<TCreate, TUpdate, TItem = TCreate>({
  queryKey,
  endpoints,
  messages,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: UseCrudMutationsOptions) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  const createMutation = useMutation({
    mutationFn: (data: TCreate) => api.post<TItem>(endpoints.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      message.success(messages?.createSuccess || t("success.created"));
      onCreateSuccess?.();
    },
    onError: (error: ApiError) => {
      message.error(getErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: TUpdate }) =>
      api.put<TItem>(endpoints.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      message.success(messages?.updateSuccess || t("success.updated"));
      onUpdateSuccess?.();
    },
    onError: (error: ApiError) => {
      message.error(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => api.delete(endpoints.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      message.success(messages?.deleteSuccess || t("success.deleted"));
      onDeleteSuccess?.();
    },
    onError: (error: ApiError) => {
      message.error(getErrorMessage(error));
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook for managing modal state
import { useState, useCallback } from "react";

export type CrudModalMode = "create" | "edit" | "view";

interface UseCrudModalState<T> {
  isOpen: boolean;
  mode: CrudModalMode;
  item: T | null;
}

export function useCrudModal<T>() {
  const [state, setState] = useState<UseCrudModalState<T>>({
    isOpen: false,
    mode: "create",
    item: null,
  });

  const openCreate = useCallback(() => {
    setState({ isOpen: true, mode: "create", item: null });
  }, []);

  const openEdit = useCallback((item: T) => {
    setState({ isOpen: true, mode: "edit", item });
  }, []);

  const openView = useCallback((item: T) => {
    setState({ isOpen: true, mode: "view", item });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ...state,
    openCreate,
    openEdit,
    openView,
    close,
  };
}

// Hook for pagination state
export function usePagination(defaultPageSize = 10) {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: defaultPageSize,
  });

  const onChange = useCallback((page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  }, []);

  const reset = useCallback(() => {
    setPagination({ page: 1, pageSize: defaultPageSize });
  }, [defaultPageSize]);

  return {
    ...pagination,
    onChange,
    reset,
  };
}

// Hook for search/filter state
export function useFilters<T extends object>(defaultFilters: T) {
  const [filters, setFilters] = useState<T>(defaultFilters);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const setAllFilters = useCallback((newFilters: T) => {
    setFilters(newFilters);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    setAllFilters,
  };
}
