import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { endpoints } from "@/shared/api/endpoints";
import type {
  RegularUser,
  RegularUserSearchRequest,
  PaginatedResponse,
} from "@/shared/api/types";

// Query keys
export const regularUsersKeys = {
  all: ["regular-users"] as const,
  list: (params: RegularUserSearchRequest) =>
    [...regularUsersKeys.all, "list", params] as const,
};

// Hooks
export function useRegularUsers(params: RegularUserSearchRequest = {}) {
  return useQuery({
    queryKey: regularUsersKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResponse<RegularUser>>(endpoints.regularUsers.list, {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
          search: params.search,
        },
      }),
  });
}
