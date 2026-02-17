// Message and Conversation DTOs

export interface ConversationDto {
  id: number;
  petAdId: number;
  petAdTitle: string;
  petAdImageUrl: string | null;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyAvatar: string | null;
  lastMessageContent: string;
  lastMessageAt: string;
  unreadCount: number;
  isArchived: boolean;
}

export interface MessageDto {
  id: number;
  conversationId: number;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
  isDeletedBySender?: boolean;
}

export interface ConversationDetailsDto {
  id: number;
  petAdId: number;
  petAdTitle: string;
  petAdImageUrl: string | null;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyAvatar: string | null;
  messages: MessageDto[];
}

export interface SendMessageCommand {
  receiverId: string;
  petAdId: number;
  content: string;
}

export interface SendMessageResponse {
  conversationId: number;
}

export interface GetConversationsQuery {
  pageNumber?: number;
  pageSize?: number;
  includeArchived?: boolean;
}

export interface ConversationListResponse {
  items: ConversationDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
