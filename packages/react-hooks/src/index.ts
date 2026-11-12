/**
 * Public exports for @pulse/react-hooks headless library.
 */

export { PulseProvider, usePulseContext } from "./context";
export type { PulseProviderProps } from "./context";

export { usePulseClient } from "./usePulseClient";
export { useConnectionState } from "./useConnectionState";
export type { ConnectionStateResult } from "./useConnectionState";

export { useConversations } from "./useConversations";
export { useMessages } from "./useMessages";
export { useActiveTyping } from "./useActiveTyping";
export { usePresence } from "./usePresence";
export type { PresenceState } from "./usePresence";

export type {
  PulseContextValue,
  UseMessagesOptions,
  UseMessagesResult,
  UseConversationsResult,
  UseActiveTypingResult,
} from "./types";

