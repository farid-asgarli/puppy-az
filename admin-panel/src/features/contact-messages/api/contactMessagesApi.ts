import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/httpClient";
import { endpoints } from "@/shared/api/endpoints";
import type { ContactMessage } from "@/shared/api/types";

const cmEndpoints = endpoints.contactMessages;

// Backend pagination response interface
interface BackendPaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Frontend pagination result interface
interface PaginatedResult<T> {
  data: T[];
  pagination: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}

// Transform backend response to frontend format
function transformPaginatedResponse<T>(
  response: BackendPaginatedResult<T>,
): PaginatedResult<T> {
  return {
    data: response.items,
    pagination: {
      totalCount: response.totalCount,
      pageSize: response.pageSize,
      currentPage: response.pageNumber,
      totalPages: response.totalPages,
    },
  };
}

// Reply request interface
interface ReplyRequest {
  reply: string;
}

// Stats interface
export interface ContactMessageStats {
  totalMessages: number;
  newMessages: number;
  readMessages: number;
  repliedMessages: number;
  spamMessages: number;
  starredMessages: number;
  archivedMessages: number;
}

// Query Keys
export const contactMessagesKeys = {
  all: ["contact-messages"] as const,
  lists: () => [...contactMessagesKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...contactMessagesKeys.lists(), params] as const,
  details: () => [...contactMessagesKeys.all, "detail"] as const,
  detail: (id: number) => [...contactMessagesKeys.details(), id] as const,
  stats: () => [...contactMessagesKeys.all, "stats"] as const,
};

// Hooks

/**
 * Fetch paginated list of contact messages
 */
export function useContactMessages(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: contactMessagesKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      // Handle pagination
      if (params.page)
        searchParams.append("pagination.number", String(params.page));
      if (params.pageSize)
        searchParams.append("pagination.size", String(params.pageSize));

      // Handle filters
      if (params.status !== undefined)
        searchParams.append("status", String(params.status));
      if (params.messageType !== undefined)
        searchParams.append("messageType", String(params.messageType));
      if (params.isSpam !== undefined)
        searchParams.append("isSpam", String(params.isSpam));
      if (params.isStarred !== undefined)
        searchParams.append("isStarred", String(params.isStarred));
      if (params.isArchived !== undefined)
        searchParams.append("isArchived", String(params.isArchived));
      if (params.search) searchParams.append("search", String(params.search));

      const url = `${endpoints.contactMessages.list}?${searchParams.toString()}`;
      const response =
        await api.get<BackendPaginatedResult<ContactMessage>>(url);
      return transformPaginatedResponse(response);
    },
  });
}

/**
 * Fetch single contact message by ID (marks as read by default)
 */
export function useContactMessage(id: number, enabled = true) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: contactMessagesKeys.detail(id),
    queryFn: async () => {
      // markAsRead=true is sent to backend - this changes status from New to Read
      const response = await api.get<ContactMessage>(
        `${endpoints.contactMessages.byId(id)}?markAsRead=true`,
      );
      // Invalidate list cache so it reflects the new status
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.stats() });
      return response;
    },
    enabled: enabled && id > 0,
  });
}

/**
 * Fetch contact message statistics
 */
export function useContactMessageStats() {
  return useQuery({
    queryKey: contactMessagesKeys.stats(),
    queryFn: async () => {
      const response = await api.get<ContactMessageStats>(
        endpoints.contactMessages.stats,
      );
      return response;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Reply to a contact message
 */
export function useReplyContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ReplyRequest }) => {
      const response = await api.post<ContactMessage>(
        endpoints.contactMessages.reply(id),
        data,
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: contactMessagesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.stats() });
    },
  });
}

/**
 * Toggle star status
 */
export function useToggleStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, starred }: { id: number; starred: boolean }) => {
      const endpoint = starred ? cmEndpoints.star(id) : cmEndpoints.unstar(id);
      const response = await api.post<ContactMessage>(endpoint, {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.stats() });
    },
  });
}

/**
 * Mark message as spam
 */
export function useMarkAsSpam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<ContactMessage>(cmEndpoints.spam(id), {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.stats() });
    },
  });
}

/**
 * Unmark message as spam
 */
export function useUnmarkAsSpam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<ContactMessage>(
        cmEndpoints.unspam(id),
        {},
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.stats() });
    },
  });
}

/**
 * Archive message
 */
export function useArchiveMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<ContactMessage>(
        cmEndpoints.archive(id),
        {},
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.stats() });
    },
  });
}

/**
 * Unarchive message
 */
export function useUnarchiveMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<ContactMessage>(
        cmEndpoints.unarchive(id),
        {},
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.stats() });
    },
  });
}

/**
 * Delete contact message
 */
export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(endpoints.contactMessages.byId(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactMessagesKeys.stats() });
    },
  });
}
