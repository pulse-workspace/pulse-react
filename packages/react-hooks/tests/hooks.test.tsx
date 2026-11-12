import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { PulseClient, MemoryStorageAdapter } from "@pulse/client-sdk";
import { PulseProvider, usePulseClient, useConnectionState, useConversations } from "../src";

function createTestClient(): PulseClient {
  return new PulseClient({
    gatewayUrl: "ws://localhost:32001/ws",
    token: "test.jwt.token",
    platform: "WEB",
    deviceId: "test-device-id",
    storage: new MemoryStorageAdapter(),
    heartbeatIntervalMs: 15000,
    reconnectBaseDelayMs: 500,
    reconnectMaxDelayMs: 3000,
    maxReconnectAttempts: 3,
    handshakeTimeoutMs: 2000,
    ackTimeoutMs: 2000,
    typingStopDelayMs: 2000,
  });
}

describe("Headless React Hooks for Pulse", () => {
  it("throws when using hook outside PulseProvider", () => {
    // Suppress console.error in test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => usePulseClient())).toThrowError(
      "usePulseContext must be used within a <PulseProvider>."
    );
    spy.mockRestore();
  });

  it("provides client and initial connection state", () => {
    const client = createTestClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PulseProvider client={client}>{children}</PulseProvider>
    );

    const { result } = renderHook(
      () => ({
        client: usePulseClient(),
        conn: useConnectionState(),
      }),
      { wrapper }
    );

    expect(result.current.client).toBe(client);
    expect(result.current.conn.state).toBe("DISCONNECTED");
    expect(result.current.conn.isDisconnected).toBe(true);
    expect(result.current.conn.isConnected).toBe(false);
  });

  it("useConversations returns empty list initially and supports refresh", async () => {
    const client = createTestClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PulseProvider client={client}>{children}</PulseProvider>
    );

    const { result } = renderHook(() => useConversations(), { wrapper });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.conversations).toEqual([]);
  });
});

