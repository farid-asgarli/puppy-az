'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '@/lib/hooks/use-auth';
import toast from 'react-hot-toast';

// Notification types matching backend DTOs
export interface NewMessageNotification {
  conversationId: number;
  messageId: number;
  senderName: string;
  content: string;
  sentAt: string;
  unreadCount: number;
}

export interface ConversationMessageNotification {
  conversationId: number;
  messageId: number;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
}

export interface NewQuestionNotification {
  questionId: number;
  petAdId: number;
  petAdTitle: string;
  questionText: string;
  questionerName: string;
  askedAt: string;
  unansweredCount: number;
}

export interface QuestionAnsweredNotification {
  questionId: number;
  petAdId: number;
  answer: string;
  answeredAt: string;
}

export interface NewReplyNotification {
  questionId: number;
  petAdId: number;
  replyId: number;
  replyText: string;
  replierName: string;
  isOwnerReply: boolean;
  createdAt: string;
}

export interface QuestionDeletedNotification {
  questionId: number;
  petAdId: number;
}

export interface ReplyDeletedNotification {
  questionId: number;
  replyId: number;
  petAdId: number;
}

export interface AnswerDeletedNotification {
  questionId: number;
  petAdId: number;
}

export interface UnreadCountNotification {
  unreadMessages: number;
  unansweredQuestions: number;
}

type NotificationHandler<T> = (notification: T) => void;

interface SignalRContextType {
  isConnected: boolean;
  connectionState: signalR.HubConnectionState;

  // Subscribe to events
  onNewMessage: (handler: NotificationHandler<NewMessageNotification>) => () => void;
  onConversationMessage: (handler: NotificationHandler<ConversationMessageNotification>) => () => void;
  onNewQuestion: (handler: NotificationHandler<NewQuestionNotification>) => () => void;
  onQuestionAnswered: (handler: NotificationHandler<QuestionAnsweredNotification>) => () => void;
  onNewReply: (handler: NotificationHandler<NewReplyNotification>) => () => void;
  onQuestionDeleted: (handler: NotificationHandler<QuestionDeletedNotification>) => () => void;
  onReplyDeleted: (handler: NotificationHandler<ReplyDeletedNotification>) => () => void;
  onAnswerDeleted: (handler: NotificationHandler<AnswerDeletedNotification>) => () => void;
  onUnreadCountUpdate: (handler: NotificationHandler<UnreadCountNotification>) => () => void;

  // Join/leave groups
  joinConversation: (conversationId: number) => Promise<void>;
  leaveConversation: (conversationId: number) => Promise<void>;
  joinPetAdQuestions: (petAdId: number) => Promise<void>;
  leavePetAdQuestions: (petAdId: number) => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | null>(null);

export function SignalRProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, getToken } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<signalR.HubConnectionState>(signalR.HubConnectionState.Disconnected);
  const [isConnected, setIsConnected] = useState(false);

  // Event handlers storage
  const handlersRef = useRef<{
    newMessage: Set<NotificationHandler<NewMessageNotification>>;
    conversationMessage: Set<NotificationHandler<ConversationMessageNotification>>;
    newQuestion: Set<NotificationHandler<NewQuestionNotification>>;
    questionAnswered: Set<NotificationHandler<QuestionAnsweredNotification>>;
    newReply: Set<NotificationHandler<NewReplyNotification>>;
    questionDeleted: Set<NotificationHandler<QuestionDeletedNotification>>;
    replyDeleted: Set<NotificationHandler<ReplyDeletedNotification>>;
    answerDeleted: Set<NotificationHandler<AnswerDeletedNotification>>;
    unreadCountUpdate: Set<NotificationHandler<UnreadCountNotification>>;
  }>({
    newMessage: new Set(),
    conversationMessage: new Set(),
    newQuestion: new Set(),
    questionAnswered: new Set(),
    newReply: new Set(),
    questionDeleted: new Set(),
    replyDeleted: new Set(),
    answerDeleted: new Set(),
    unreadCountUpdate: new Set(),
  });

  // Create and connect to SignalR hub
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('[SignalR] Not authenticated, skipping connection');
      return;
    }

    const connect = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.log('[SignalR] No token available');
          return;
        }

        const hubUrl = `${process.env.NEXT_PUBLIC_API_URL}/hubs/notifications`;
        console.log('[SignalR] Connecting to:', hubUrl);

        const connection = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: () => token,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Set up event handlers
        connection.on('ReceiveNewMessage', (notification: NewMessageNotification) => {
          console.log('[SignalR] ReceiveNewMessage:', notification);
          // Show toast notification for new message
          toast(`💬 ${notification.senderName}: ${notification.content.substring(0, 50)}${notification.content.length > 50 ? '...' : ''}`, {
            duration: 5000,
            position: 'top-right',
            style: {
              background: '#3b82f6',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '12px',
            },
          });
          handlersRef.current.newMessage.forEach((handler) => handler(notification));
        });

        connection.on('ReceiveConversationMessage', (notification: ConversationMessageNotification) => {
          console.log('[SignalR] ReceiveConversationMessage:', notification);
          handlersRef.current.conversationMessage.forEach((handler) => handler(notification));
        });

        connection.on('ReceiveNewQuestion', (notification: NewQuestionNotification) => {
          console.log('[SignalR] ReceiveNewQuestion:', notification);
          // Show toast notification for new question
          toast(`❓ ${notification.questionerName} "${notification.petAdTitle}" elanınıza sual yazdı`, {
            duration: 5000,
            position: 'top-right',
            style: {
              background: '#10b981',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '12px',
            },
          });
          handlersRef.current.newQuestion.forEach((handler) => handler(notification));
        });

        connection.on('ReceiveQuestionAnswered', (notification: QuestionAnsweredNotification) => {
          console.log('[SignalR] ReceiveQuestionAnswered:', notification);
          // Show toast notification for question answered
          toast(`✅ Sualınız cavablandırıldı`, {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#10b981',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '12px',
            },
          });
          handlersRef.current.questionAnswered.forEach((handler) => handler(notification));
        });

        connection.on('ReceiveNewReply', (notification: NewReplyNotification) => {
          console.log('[SignalR] ReceiveNewReply:', notification);
          // Show toast notification for new reply
          toast(`💬 ${notification.replierName} sualınıza cavab yazdı`, {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#8b5cf6',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '12px',
            },
          });
          handlersRef.current.newReply.forEach((handler) => handler(notification));
        });

        connection.on('ReceiveQuestionDeleted', (notification: QuestionDeletedNotification) => {
          console.log('[SignalR] ReceiveQuestionDeleted:', notification);
          handlersRef.current.questionDeleted.forEach((handler) => handler(notification));
        });

        connection.on('ReceiveReplyDeleted', (notification: ReplyDeletedNotification) => {
          console.log('[SignalR] ReceiveReplyDeleted:', notification);
          handlersRef.current.replyDeleted.forEach((handler) => handler(notification));
        });

        connection.on('ReceiveAnswerDeleted', (notification: AnswerDeletedNotification) => {
          console.log('[SignalR] ReceiveAnswerDeleted:', notification);
          handlersRef.current.answerDeleted.forEach((handler) => handler(notification));
        });

        connection.on('ReceiveUnreadCountUpdate', (notification: UnreadCountNotification) => {
          console.log('[SignalR] ReceiveUnreadCountUpdate:', notification);
          handlersRef.current.unreadCountUpdate.forEach((handler) => handler(notification));
        });

        // Connection state handlers
        connection.onreconnecting((error) => {
          console.log('[SignalR] Reconnecting...', error);
          setConnectionState(signalR.HubConnectionState.Reconnecting);
          setIsConnected(false);
        });

        connection.onreconnected((connectionId) => {
          console.log('[SignalR] Reconnected with ID:', connectionId);
          setConnectionState(signalR.HubConnectionState.Connected);
          setIsConnected(true);
        });

        connection.onclose((error) => {
          console.log('[SignalR] Connection closed', error);
          setConnectionState(signalR.HubConnectionState.Disconnected);
          setIsConnected(false);
        });

        // Start connection
        await connection.start();
        console.log('[SignalR] Connected successfully');
        connectionRef.current = connection;
        setConnectionState(signalR.HubConnectionState.Connected);
        setIsConnected(true);
      } catch (error) {
        console.error('[SignalR] Connection failed:', error);
        setConnectionState(signalR.HubConnectionState.Disconnected);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (connectionRef.current) {
        console.log('[SignalR] Stopping connection...');
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
        setConnectionState(signalR.HubConnectionState.Disconnected);
      }
    };
  }, [isAuthenticated, getToken]);

  // Subscribe functions
  const onNewMessage = useCallback((handler: NotificationHandler<NewMessageNotification>) => {
    handlersRef.current.newMessage.add(handler);
    return () => {
      handlersRef.current.newMessage.delete(handler);
    };
  }, []);

  const onConversationMessage = useCallback((handler: NotificationHandler<ConversationMessageNotification>) => {
    handlersRef.current.conversationMessage.add(handler);
    return () => {
      handlersRef.current.conversationMessage.delete(handler);
    };
  }, []);

  const onNewQuestion = useCallback((handler: NotificationHandler<NewQuestionNotification>) => {
    handlersRef.current.newQuestion.add(handler);
    return () => {
      handlersRef.current.newQuestion.delete(handler);
    };
  }, []);

  const onQuestionAnswered = useCallback((handler: NotificationHandler<QuestionAnsweredNotification>) => {
    handlersRef.current.questionAnswered.add(handler);
    return () => {
      handlersRef.current.questionAnswered.delete(handler);
    };
  }, []);

  const onNewReply = useCallback((handler: NotificationHandler<NewReplyNotification>) => {
    handlersRef.current.newReply.add(handler);
    return () => {
      handlersRef.current.newReply.delete(handler);
    };
  }, []);

  const onQuestionDeleted = useCallback((handler: NotificationHandler<QuestionDeletedNotification>) => {
    handlersRef.current.questionDeleted.add(handler);
    return () => {
      handlersRef.current.questionDeleted.delete(handler);
    };
  }, []);

  const onReplyDeleted = useCallback((handler: NotificationHandler<ReplyDeletedNotification>) => {
    handlersRef.current.replyDeleted.add(handler);
    return () => {
      handlersRef.current.replyDeleted.delete(handler);
    };
  }, []);

  const onAnswerDeleted = useCallback((handler: NotificationHandler<AnswerDeletedNotification>) => {
    handlersRef.current.answerDeleted.add(handler);
    return () => {
      handlersRef.current.answerDeleted.delete(handler);
    };
  }, []);

  const onUnreadCountUpdate = useCallback((handler: NotificationHandler<UnreadCountNotification>) => {
    handlersRef.current.unreadCountUpdate.add(handler);
    return () => {
      handlersRef.current.unreadCountUpdate.delete(handler);
    };
  }, []);

  // Group join/leave functions
  const joinConversation = useCallback(async (conversationId: number) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('JoinConversation', conversationId);
        console.log('[SignalR] Joined conversation:', conversationId);
      } catch (error) {
        console.error('[SignalR] Failed to join conversation:', error);
      }
    }
  }, []);

  const leaveConversation = useCallback(async (conversationId: number) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('LeaveConversation', conversationId);
        console.log('[SignalR] Left conversation:', conversationId);
      } catch (error) {
        console.error('[SignalR] Failed to leave conversation:', error);
      }
    }
  }, []);

  const joinPetAdQuestions = useCallback(async (petAdId: number) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('JoinPetAdQuestions', petAdId);
        console.log('[SignalR] Joined pet ad questions:', petAdId);
      } catch (error) {
        console.error('[SignalR] Failed to join pet ad questions:', error);
      }
    }
  }, []);

  const leavePetAdQuestions = useCallback(async (petAdId: number) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('LeavePetAdQuestions', petAdId);
        console.log('[SignalR] Left pet ad questions:', petAdId);
      } catch (error) {
        console.error('[SignalR] Failed to leave pet ad questions:', error);
      }
    }
  }, []);

  const value: SignalRContextType = {
    isConnected,
    connectionState,
    onNewMessage,
    onConversationMessage,
    onNewQuestion,
    onQuestionAnswered,
    onNewReply,
    onQuestionDeleted,
    onReplyDeleted,
    onAnswerDeleted,
    onUnreadCountUpdate,
    joinConversation,
    leaveConversation,
    joinPetAdQuestions,
    leavePetAdQuestions,
  };

  return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>;
}

// Hook for required SignalR context
export function useSignalR(): SignalRContextType {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
}

// Hook for optional SignalR context (won't throw if not wrapped)
export function useSignalROptional(): SignalRContextType | null {
  return useContext(SignalRContext);
}
