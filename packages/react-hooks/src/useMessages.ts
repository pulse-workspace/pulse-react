import { useEffect, useState, useCallback, useRef } from "react";
import type { StoredMessage } from "@pulse/client-sdk";
import { usePulseClient } from "./usePulseClient";
import type { UseMessagesOptions, UseMessagesResult } from "./types";

const DEFAULT_PAGE_LIMIT = 50;

/**
 * Manages the message thread for a given conversation.
 * Provides optimistic UI updates, pagination, and real-time message stream synchronization.
 *
 * @param convId The unique identifier of the conversation
 * @param options Pagination options (limit per query)
 * @returns UseMessagesResult with message list, send helpers, and loadMore pagination
 */
export function useMessages(convId: string, options?: UseMessagesOptions): UseMessagesResult {
  const client = usePulseClient();
  const limit = options?.limit || DEFAULT_PAGE_LIMIT;
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const convIdRef = useRef(convId);

  useEffect(() => {
    convIdRef.current = convId;
  }, [convId]);

  /**
   * Loads initial messages for the conversation from local storage.
   */
  const loadInitial = useCallback(async (): Promise<void> => {
    if (!convId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const history = await client.message.getHistory(convId, limit);
      // History is sorted by seq ascending from storage
      setMessages(history);
      setHasMore(history.length >= limit);
    } finally {
      setLoading(false);
    }
  }, [client, convId, limit]);

  /**
   * Loads older messages before the earliest message sequence.
   */
  const loadMore = useCallback(async (): Promise<void> => {
    if (!convId || !hasMore || messages.length === 0) return;
    const earliest = messages[0];
    const beforeSeq = earliest.seq > 0 ? earliest.seq : undefined;
    if (!beforeSeq) return;

    const older = await client.message.getHistory(convId, limit, beforeSeq);
    if (older.length < limit) {
      setHasMore(false);
    }
    if (older.length > 0) {
      setMessages((prev) => [...older, ...prev]);
    }
  }, [client, convId, hasMore, limit, messages]);

  /**
   * Dispatches a text message optimistically.
   */
  const sendText = useCallback(
    async (text: string): Promise<StoredMessage> => {
      return client.message.sendText(convId, text);
    },
    [client, convId]
  );

  /**
   * Dispatches an image message optimistically.
   */
  const sendImage = useCallback(
    async (url: string, width: number, height: number, sizeBytes: number): Promise<StoredMessage> => {
      return client.message.sendImage(convId, url, width, height, sizeBytes);
    },
    [client, convId]
  );

  /**
   * Dispatches a file attachment message optimistically.
   */
  const sendFile = useCallback(
    async (url: string, fileName: string, sizeBytes: number): Promise<StoredMessage> => {
      return client.message.sendFile(convId, url, fileName, sizeBytes);
    },
    [client, convId]
  );

  /**
   * Upserts or replaces a message in local component state.
   */
  const upsertMessage = useCallback((msg: StoredMessage) => {
    if (msg.convID !== convIdRef.current) return;

    setMessages((prev) => {
      const index = prev.findIndex((m) => m.clientMsgID === msg.clientMsgID);
      if (index >= 0) {
        const next = [...prev];
        next[index] = msg;
        return next;
      }
      return [...prev, msg];
    });
  }, []);

  useEffect(() => {
    loadInitial();

    const unsubOptimistic = client.on("message:optimistic", (msg: StoredMessage) => {
      upsertMessage(msg);
    });

    const unsubSent = client.on("message:sent", (msg: StoredMessage) => {
      upsertMessage(msg);
    });

    const unsubFailed = client.on("message:failed", (msg: StoredMessage) => {
      upsertMessage(msg);
    });

    const unsubNew = client.on("message:new", (msg: StoredMessage) => {
      upsertMessage(msg);
    });

    return () => {
      unsubOptimistic();
      unsubSent();
      unsubFailed();
      unsubNew();
    };
  }, [client, loadInitial, upsertMessage]);

  return {
    messages,
    loading,
    hasMore,
    loadMore,
    sendText,
    sendImage,
    sendFile,
  };
}

