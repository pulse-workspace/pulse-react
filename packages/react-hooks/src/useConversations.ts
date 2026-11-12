import { useEffect, useState, useCallback } from "react";
import type { StoredConversation } from "@pulse/client-sdk";
import { usePulseClient } from "./usePulseClient";
import type { UseConversationsResult } from "./types";

/**
 * Manages the reactive list of conversations from local persistent storage.
 * Automatically refreshes on new messages or read receipts, and keeps list ordered by latest activity.
 *
 * @returns UseConversationsResult with conversation list, loading state, and markAsRead helper
 */
export function useConversations(): UseConversationsResult {
  const client = usePulseClient();
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Refreshes conversation list from local cache.
   */
  const refresh = useCallback(async (): Promise<void> => {
    try {
      const list = await client.conversation.getConversations();
      // Sort by updatedAt descending
      list.sort((a, b) => b.updatedAt - a.updatedAt);
      setConversations(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Marks a conversation as read and updates local state.
   */
  const markAsRead = useCallback(
    async (convId: string, lastServerMsgId: string): Promise<void> => {
      await client.conversation.markAsRead(convId, lastServerMsgId);
      await refresh();
    },
    [client, refresh]
  );

  useEffect(() => {
    refresh();

    // Listen for events that affect conversation list (new messages, sent messages, optimistic messages)
    const unsubNew = client.on("message:new", () => {
      refresh();
    });
    const unsubSent = client.on("message:sent", () => {
      refresh();
    });
    const unsubOptimistic = client.on("message:optimistic", () => {
      refresh();
    });

    return () => {
      unsubNew();
      unsubSent();
      unsubOptimistic();
    };
  }, [client, refresh]);

  return {
    conversations,
    loading,
    error,
    refresh,
    markAsRead,
  };
}

