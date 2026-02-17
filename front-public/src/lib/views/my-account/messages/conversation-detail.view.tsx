"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  IconChevronLeft,
  IconSend,
  IconLoader2,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Heading, Text } from "@/lib/primitives/typography";
import { cn } from "@/lib/external/utils";
import TransitionLink from "@/lib/components/transition-link";
import { Avatar } from "@/lib/components/avatar";
import { messageService } from "@/lib/api/services/message.service";
import type {
  ConversationDetailsDto,
  MessageDto,
} from "@/lib/api/types/message.types";
import { useAuth } from "@/lib/hooks/use-auth";

const ConversationDetailView = () => {
  const t = useTranslations("messages");
  const { id } = useParams();
  const { getToken, user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [conversation, setConversation] =
    useState<ConversationDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const previousMessageCountRef = useRef<number>(0);

  // Edit state
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editMessageText, setEditMessageText] = useState("");
  const [editingLoading, setEditingLoading] = useState(false);

  // Delete state
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    loadConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [messageText]);

  // Auto-refresh messages with polling (only when tab is visible)
  useEffect(() => {
    const POLLING_INTERVAL = 3000; // 3 seconds for better responsiveness
    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      intervalId = setInterval(async () => {
        // Only poll if document is visible (tab is active)
        if (document.visibilityState === "visible") {
          console.log("[Polling] Checking for new messages...");
          await loadConversation();
        }
      }, POLLING_INTERVAL);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[Visibility] Tab became visible, resuming polling");
        // Resume polling when tab becomes visible
        if (!intervalId) {
          startPolling();
        }
        // Also refresh immediately when tab becomes visible
        loadConversation();
      } else {
        console.log("[Visibility] Tab hidden, pausing polling");
        // Stop polling when tab is hidden
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    // Start polling
    console.log("[Polling] Starting message polling");
    startPolling();

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      console.log("[Polling] Cleaning up polling");
      if (intervalId) {
        clearInterval(intervalId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const scrollToBottom = () => {
    // Use container scroll instead of scrollIntoView to prevent page scroll
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const loadConversation = async () => {
    try {
      const token = await getToken();
      if (!token || !id) {
        if (!loading) return; // Don't set loading false during polling
        setLoading(false);
        return;
      }
      const conversationId = parseInt(id as string, 10);
      if (isNaN(conversationId)) {
        if (!loading) return;
        setLoading(false);
        return;
      }

      console.log("[Load] Fetching conversation details...");
      const data = await messageService.getConversationDetails(
        conversationId,
        token,
      );

      console.log(`[Load] Received ${data.messages.length} messages`);

      // Track if new messages arrived
      const previousCount = previousMessageCountRef.current;
      const newCount = data.messages.length;

      setConversation(data);

      // Update the ref for next comparison
      previousMessageCountRef.current = newCount;

      // Trigger unread count refresh in navbar
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("messagesRead"));
      }

      // Only scroll if there are new messages
      if (newCount > previousCount) {
        console.log(
          `[Scroll] New messages detected (${previousCount} -> ${newCount}), scrolling...`,
        );
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error("[Load] Failed to load conversation:", error);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || sending || !conversation) {
      console.log("[Send] Message blocked:", {
        hasText: !!messageText.trim(),
        sending,
        hasConversation: !!conversation,
      });
      return;
    }

    const messageToSend = messageText.trim();
    console.log("[Send] Attempting to send message:", {
      receiverId: conversation.otherPartyId,
      petAdId: conversation.petAdId,
      contentLength: messageToSend.length,
    });

    setSending(true);
    setMessageText(""); // Clear immediately for better UX

    try {
      const token = await getToken();
      if (!token) {
        console.error("[Send] No auth token available");
        setMessageText(messageToSend); // Restore on error
        return;
      }

      const response = await messageService.sendMessage(
        {
          receiverId: conversation.otherPartyId,
          petAdId: conversation.petAdId,
          content: messageToSend,
        },
        token,
      );

      console.log("[Send] Message sent response:", response);

      // Check if the response indicates success
      if (response && typeof response === "object" && "isSuccess" in response) {
        if (!response.isSuccess) {
          const err = (response as { error?: string }).error;
          console.error("[Send] Backend error:", err);
          throw new Error(err || "Failed to send message");
        }
      }

      // Reload conversation to get new message
      await loadConversation();
    } catch (error) {
      console.error("[Send] Failed to send message:", error);
      // Restore message text on error so user doesn't lose it
      setMessageText(messageToSend);
      alert("Mesaj göndərilə bilmədi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setSending(false);
    }
  };

  const handleStartEdit = (message: MessageDto) => {
    setEditingMessageId(message.id);
    setEditMessageText(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditMessageText("");
  };

  const handleSaveEdit = async () => {
    if (!editMessageText.trim() || !editingMessageId) return;

    setEditingLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await messageService.updateMessage(
        editingMessageId,
        editMessageText.trim(),
        token,
      );

      if (response.isSuccess) {
        setEditingMessageId(null);
        setEditMessageText("");
        await loadConversation();
      } else {
        alert(response.error || "Mesaj yenilənə bilmədi");
      }
    } catch (error) {
      console.error("[Edit] Failed to update message:", error);
      alert("Mesaj yenilənə bilmədi");
    } finally {
      setEditingLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm(t("deleteConfirm") || "Mesajı silmək istədiyinizə əminsiniz?"))
      return;

    setDeletingMessageId(messageId);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await messageService.deleteMessage(messageId, token);

      if (response.isSuccess) {
        await loadConversation();
      } else {
        alert(response.error || "Mesaj silinə bilmədi");
      }
    } catch (error) {
      console.error("[Delete] Failed to delete message:", error);
      alert("Mesaj silinə bilmədi");
    } finally {
      setDeletingMessageId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Heading variant="subsection" className="mb-2">
            {t("conversationNotFound")}
          </Heading>
          <TransitionLink
            href="/my-account/messages"
            className="text-primary-600 hover:underline"
          >
            {t("backToMessages")}
          </TransitionLink>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col bg-gray-50"
      style={{ height: "calc(100vh - 80px)" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <TransitionLink
              href="/my-account/messages"
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IconChevronLeft className="w-6 h-6" />
            </TransitionLink>

            {/* Other party info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar
                src={conversation.otherPartyAvatar}
                name={conversation.otherPartyName}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <Heading
                  variant="subsection"
                  as="h1"
                  className="text-lg font-semibold truncate"
                >
                  {conversation.otherPartyName}
                </Heading>
                <Text variant="small" className="text-gray-600 truncate">
                  {conversation.petAdTitle}
                </Text>
              </div>
            </div>

            {/* Pet Ad Thumbnail */}
            {conversation.petAdImageUrl && (
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 hidden sm:block">
                <img
                  src={conversation.petAdImageUrl}
                  alt={conversation.petAdTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {conversation.messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                isEditing={editingMessageId === message.id}
                editText={editMessageText}
                editLoading={editingLoading}
                isDeleting={deletingMessageId === message.id}
                onStartEdit={() => handleStartEdit(message)}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onEditTextChange={setEditMessageText}
                onDelete={() => handleDeleteMessage(message.id)}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= 1000) {
                    setMessageText(newValue);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder={t("typeMessage")}
                rows={1}
                style={{
                  minHeight: "48px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!messageText.trim() || sending}
                className={cn(
                  "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md flex-shrink-0",
                  messageText.trim() && !sending
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 hover:shadow-lg transform hover:-translate-y-0.5"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed",
                )}
              >
                {sending ? (
                  <IconLoader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <IconSend className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">{t("send")}</span>
              </button>
            </div>
            {messageText.length > 0 && (
              <div
                className="text-xs text-right"
                style={{
                  color: messageText.length >= 1000 ? "#ef4444" : "#6b7280",
                }}
              >
                {messageText.length} / 1000
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// Message bubble component
const MessageBubble = ({
  message,
  isOwn,
  isEditing,
  editText,
  editLoading,
  isDeleting,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditTextChange,
  onDelete,
}: {
  message: MessageDto;
  isOwn: boolean;
  isEditing: boolean;
  editText: string;
  editLoading: boolean;
  isDeleting: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditTextChange: (text: string) => void;
  onDelete: () => void;
}) => {
  const t = useTranslations("messages");
  const messageTime = new Date(message.createdAt).toLocaleTimeString("az", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Check if message was edited - updatedAt must exist, not be null/undefined, and be meaningfully different from createdAt
  const isEdited = (() => {
    if (!message.updatedAt) return false;
    const createdTime = new Date(message.createdAt).getTime();
    const updatedTime = new Date(message.updatedAt).getTime();
    // Must be at least 2 seconds difference to be considered edited
    const diff = updatedTime - createdTime;
    console.log(
      `[Message ${message.id}] createdAt: ${message.createdAt}, updatedAt: ${message.updatedAt}, diff: ${diff}ms`,
    );
    return diff > 2000;
  })();

  return (
    <div className={cn("flex group", isOwn ? "justify-end" : "justify-start")}>
      {/* Action buttons for own messages - left side */}
      {isOwn && !isEditing && (
        <div className="flex items-center gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onStartEdit}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            title={t("edit")}
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
            title={t("delete")}
          >
            {isDeleting ? (
              <IconLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              <IconTrash className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2.5",
          isOwn
            ? "bg-teal-500 text-white rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm",
        )}
      >
        {isEditing ? (
          <div className="space-y-2 min-w-[500px]">
            <textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              className="w-full min-w-[480px] px-3 py-2 rounded-lg border border-primary-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelEdit}
                className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
              <button
                onClick={onSaveEdit}
                disabled={editLoading || !editText.trim()}
                className="p-1.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50"
              >
                {editLoading ? (
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <IconCheck className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            <Text
              className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap break-words",
                isOwn ? "text-white" : "text-gray-900",
              )}
            >
              {message.content}
            </Text>
            <div
              className={cn(
                "flex items-center gap-2 mt-1",
                isOwn ? "text-white" : "text-gray-500",
              )}
            >
              <Text variant="tiny" className={isOwn ? "opacity-90" : ""}>
                {messageTime}
              </Text>
              {isEdited && (
                <Text
                  variant="tiny"
                  className={cn("italic", isOwn ? "opacity-90" : "")}
                >
                  ({t("edited")})
                </Text>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action buttons for other's messages - right side */}
      {!isOwn && !isEditing && (
        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* No edit/delete for received messages */}
        </div>
      )}
    </div>
  );
};

export default ConversationDetailView;
