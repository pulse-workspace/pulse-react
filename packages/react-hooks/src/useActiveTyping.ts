import { useEffect, useState, useCallback, useRef } from "react";
import { usePulseClient } from "./usePulseClient";
import type { UseActiveTypingResult } from "./types";

/**
 * Tracks active typing indicators in a conversation and emits debounced typing events.
 *
 * @param convId The unique identifier of the conversation
 * @returns UseActiveTypingResult with active typing user list and setTyping dispatcher
 */
export function useActiveTyping(convId: string): UseActiveTypingResult {
  const client = usePulseClient();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const clearTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /**
   * Dispatches typing start/stop to the gateway.
   */
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!convId) return;
      client.user.setTyping(convId, isTyping);
    },
    [client, convId]
  );

  useEffect(() => {
    // Clear state on conversation switch
    setTypingUsers([]);
    clearTimersRef.current.forEach((t) => clearTimeout(t));
    clearTimersRef.current.clear();

    const unsubTyping = client.on(
      "user:typing",
      (payload: { convID: string; userID: string; isTyping: boolean }) => {
        if (payload.convID !== convId) return;

        const userId = payload.userID;

        if (payload.isTyping) {
          setTypingUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));

          // Auto-remove after 3 seconds safety window
          if (clearTimersRef.current.has(userId)) {
            clearTimeout(clearTimersRef.current.get(userId)!);
          }
          const timer = setTimeout(() => {
            setTypingUsers((prev) => prev.filter((u) => u !== userId));
            clearTimersRef.current.delete(userId);
          }, 3000);
          clearTimersRef.current.set(userId, timer);
        } else {
          setTypingUsers((prev) => prev.filter((u) => u !== userId));
          if (clearTimersRef.current.has(userId)) {
            clearTimeout(clearTimersRef.current.get(userId)!);
            clearTimersRef.current.delete(userId);
          }
        }
      }
    );

    return () => {
      unsubTyping();
      clearTimersRef.current.forEach((t) => clearTimeout(t));
      clearTimersRef.current.clear();
    };
  }, [client, convId]);

  return {
    typingUsers,
    setTyping,
  };
}

