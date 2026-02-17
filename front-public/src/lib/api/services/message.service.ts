import { BaseService } from "../core/base-service";
import type {
  ConversationDto,
  ConversationDetailsDto,
  SendMessageCommand,
  SendMessageResponse,
} from "../types/message.types";

/**
 * Message Service
 * Handles message and conversation operations
 */
export class MessageService extends BaseService {
  /**
   * Get all conversations for the current user
   */
  async getConversations(
    token: string,
    locale?: string,
  ): Promise<ConversationDto[]> {
    const context = this.withAuth(token, locale);
    return this.http.get<ConversationDto[]>(
      "/api/messages/conversations",
      context,
    );
  }

  /**
   * Get conversation details with messages
   */
  async getConversationDetails(
    conversationId: number,
    token: string,
    locale?: string,
  ): Promise<ConversationDetailsDto> {
    const context = this.withAuth(token, locale);
    return this.http.get<ConversationDetailsDto>(
      `/api/messages/conversations/${conversationId}`,
      context,
    );
  }

  /**
   * Send a message
   */
  async sendMessage(
    command: SendMessageCommand,
    token: string,
    locale?: string,
  ): Promise<SendMessageResponse> {
    const context = this.withAuth(token, locale);
    return this.http.post<SendMessageResponse>(
      "/api/messages/send",
      command,
      context,
    );
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(token: string, locale?: string): Promise<number> {
    const context = this.withAuth(token, locale);
    const response = await this.http.get<{ unreadCount: number }>(
      "/api/messages/unread-count",
      context,
    );
    return response.unreadCount;
  }

  /**
   * Update a message
   */
  async updateMessage(
    messageId: number,
    content: string,
    token: string,
    locale?: string,
  ): Promise<{ isSuccess: boolean; error?: string }> {
    const context = this.withAuth(token, locale);
    return this.http.put<{ isSuccess: boolean; error?: string }>(
      `/api/messages/${messageId}`,
      { content },
      context,
    );
  }

  /**
   * Delete a message
   */
  async deleteMessage(
    messageId: number,
    token: string,
    locale?: string,
  ): Promise<{ isSuccess: boolean; error?: string }> {
    const context = this.withAuth(token, locale);
    return this.http.delete<{ isSuccess: boolean; error?: string }>(
      `/api/messages/${messageId}`,
      context,
    );
  }
}

/**
 * Message service
 * Handles all messaging-related API calls
 */

export const messageService = new MessageService();
