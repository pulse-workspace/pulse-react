import { useEffect, useState, useCallback } from "react";
import { usePulseClient } from "./usePulseClient";

export interface PresenceState {
  userId: string;
  isOnline: boolean;
  lastSeen?: number;
}

/**
 * Tracks online and offline presence status for user IDs.
 *
 * @param userIds List of user IDs to monitor
 * @returns Map of user ID to presence status
 */
export function usePresence(userIds: string[] = []): Record<string, PresenceState> {
  const client = usePulseClient();
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceState>>({});

  const updatePresence = useCallback((userId: string, isOnline: boolean, lastSeen?: number) => {
    setPresenceMap((prev) => ({
      ...prev,
      [userId]: { userId, isOnline, lastSeen },
    }));
  }, []);

  useEffect(() => {
    const unsub = client.on("user:presence", (payload: { userID: string; status: number; lastSeen?: number }) => {
      if (userIds.length === 0 || userIds.includes(payload.userID)) {
        updatePresence(payload.userID, payload.status === 1, payload.lastSeen);
      }
    });

    return () => {
      unsub();
    };
  }, [client, userIds, updatePresence]);

  return presenceMap;
}

