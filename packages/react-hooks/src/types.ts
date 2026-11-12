import type {
  PulseClient,
  ConnectionState,
  WelcomePayload,
  StoredConversation,
  StoredMessage,
} from "@pulse/client-sdk";

/**
 * Context value structure exposed by PulseProvider.
 */
export interface PulseContextValue {
  client: PulseClient;
  connectionState: ConnectionState;
  session: WelcomePayload | null;
}

/**
 * Options for pagination and loading messages in useMessages hook.
 */
export interface UseMessagesOptions {
  limit?: number;
}

/**
 * Return state for useMessages hook.
 */
export interface UseMessagesResult {
  messages: StoredMessage[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  sendText: (text: string) => Promise<StoredMessage>;
  sendImage: (url: string, width: number, height: number, sizeBytes: number) => Promise<StoredMessage>;
  sendFile: (url: string, fileName: string, sizeBytes: number) => Promise<StoredMessage>;
}

/**
 * Return state for useConversations hook.
 */
export interface UseConversationsResult {
  conversations: StoredConversation[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  markAsRead: (convId: string, lastServerMsgId: string) => Promise<void>;
}

/**
 * Return state for useActiveTyping hook.
 */
export interface UseActiveTypingResult {
  typingUsers: string[];
  setTyping: (isTyping: boolean) => void;
}

