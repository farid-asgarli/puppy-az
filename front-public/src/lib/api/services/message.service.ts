import { BaseService } from "../core/base-service";
import {
  PaginatedResult,
  QuerySpecification,
} from "@/lib/api/types/common.types";

/**
 * Send message command
 */
export interface SendMessageCommand {
  receiverId: string;
  petAdId: number;
  content: string;
}

/**
 * Message DTO
 */
export interface MessageDto {
  id: number;
  conversationId: number;
  senderId: string;
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Conversation DTO
 */
export interface ConversationDto {
  id: number;
  petAdId: number;
  petAdTitle: string;
  petAdImageUrl: string | null;
  otherUserId: string;
  otherUserName: string;
  otherUserProfilePictureUrl: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

/**
 * Conversation detail DTO
 */
export interface ConversationDetailDto extends ConversationDto {
  messages: MessageDto[];
}

/**
 * Message service
 * Handles all messaging-related API calls
 */
export class MessageService extends BaseService {
  /**
   * Send a message to a user about a pet ad
   */
  async sendMessage(
    command: SendMessageCommand,
    token: string,
    locale?: string,
  ): Promise<{ conversationId: number }> {
    const context = this.withAuth(token, locale);
    return this.http.post<{ conversationId: number }>(
      "/api/messages",
      command,
      context,
    );
  }

  /**
   * Get user's conversations
   */
  async getConversations(
    query: QuerySpecification,
    token: string,
    locale?: string,
  ): Promise<PaginatedResult<ConversationDto>> {
    const context = this.withAuth(token, locale);
    return this.http.post<PaginatedResult<ConversationDto>>(
      "/api/messages/conversations",
      query,
      context,
    );
  }

  /**
   * Get a specific conversation with messages
   */
  async getConversation(
    conversationId: number,
    token: string,
    locale?: string,
  ): Promise<ConversationDetailDto> {
    const context = this.withAuth(token, locale);
    return this.http.get<ConversationDetailDto>(
      `/api/messages/conversations/${conversationId}`,
      context,
    );
  }

  /**
   * Send a reply in an existing conversation
   */
  async sendReply(
    conversationId: number,
    content: string,
    token: string,
    locale?: string,
  ): Promise<MessageDto> {
    const context = this.withAuth(token, locale);
    return this.http.post<MessageDto>(
      `/api/messages/conversations/${conversationId}/reply`,
      { content },
      context,
    );
  }

  /**
   * Mark messages in a conversation as read
   */
  async markAsRead(
    conversationId: number,
    token: string,
    locale?: string,
  ): Promise<void> {
    const context = this.withAuth(token, locale);
    return this.http.post<void>(
      `/api/messages/conversations/${conversationId}/read`,
      {},
      context,
    );
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(token: string, locale?: string): Promise<number> {
    const context = this.withAuth(token, locale);
    return this.http.get<number>("/api/messages/unread-count", context);
  }
}

export const messageService = new MessageService();
