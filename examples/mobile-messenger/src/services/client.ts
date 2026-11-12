import { PulseClient } from "@pulse/client-sdk";
import { ReactNativeStorageAdapter, IAsyncStorageBackend } from "@pulse/react-native";
import { getAppConfig } from "../config/env";

/**
 * Local storage adapter implementing IAsyncStorageBackend for browser/hybrid runtime.
 */
class BrowserAsyncStorage implements IAsyncStorageBackend {
  async getItem(key: string): Promise<string | null> {
    return window.localStorage.getItem(key);
  }
  async setItem(key: string, value: string): Promise<void> {
    window.localStorage.setItem(key, value);
  }
  async removeItem(key: string): Promise<void> {
    window.localStorage.removeItem(key);
  }
}

let activeClient: PulseClient | null = null;

/**
 * Initializes and connects the singleton PulseClient with Mobile Storage Adapter.
 *
 * Business Logic:
 * Uses Fail-Fast getAppConfig() to fetch valid wsUrl and apiUrl.
 * Pairs with ReactNativeStorageAdapter for persistent offline queuing and gapless message storage.
 */
export async function initializeClient(userId: string, token: string): Promise<PulseClient> {
  if (activeClient) {
    activeClient.disconnect();
  }

  const config = getAppConfig();
  const storage = new ReactNativeStorageAdapter(new BrowserAsyncStorage(), userId);

  activeClient = new PulseClient({
    gatewayUrl: config.wsUrl,
    token,
    platform: "MOBILE_REACT_NATIVE",
    deviceId: `dev_${userId}`,
    storage,
    heartbeatIntervalMs: 25000,
    reconnectBaseDelayMs: 1000,
    reconnectMaxDelayMs: 30000,
    maxReconnectAttempts: 10,
    handshakeTimeoutMs: 5000,
    ackTimeoutMs: 5000,
    typingStopDelayMs: 3000,
  });

  await activeClient.connect();
  return activeClient;
}

/**
 * Returns the currently active PulseClient or null if disconnected.
 */
export function getActiveClient(): PulseClient | null {
  return activeClient;
}

/**
 * Disconnects the active client session.
 */
export function logoutClient(): void {
  if (activeClient) {
    activeClient.disconnect();
    activeClient = null;
  }
  window.localStorage.removeItem("pulse_mobile_user_id");
  window.localStorage.removeItem("pulse_mobile_token");
}
