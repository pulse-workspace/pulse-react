import type { PulseClient } from "@pulse/client-sdk";
import { usePulseContext } from "./context";

/**
 * Accesses the underlying PulseClient instance from React Context.
 * Used for direct access to client managers and custom event subscriptions.
 *
 * @returns PulseClient instance
 */
export function usePulseClient(): PulseClient {
  const { client } = usePulseContext();
  return client;
}

