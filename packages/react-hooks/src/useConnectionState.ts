import type { ConnectionState, WelcomePayload } from "@pulse/client-sdk";
import { usePulseContext } from "./context";

export interface ConnectionStateResult {
  state: ConnectionState;
  session: WelcomePayload | null;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  isDisconnected: boolean;
}

/**
 * Retrieves the real-time connection state and session info of PulseClient.
 * Provides helper booleans for displaying status badges and offline banners.
 *
 * @returns ConnectionStateResult with connection state flags and active session
 */
export function useConnectionState(): ConnectionStateResult {
  const { connectionState, session } = usePulseContext();

  return {
    state: connectionState,
    session,
    isConnected: connectionState === "CONNECTED",
    isConnecting: connectionState === "CONNECTING",
    isReconnecting: connectionState === "RECONNECTING",
    isDisconnected: connectionState === "DISCONNECTED",
  };
}

