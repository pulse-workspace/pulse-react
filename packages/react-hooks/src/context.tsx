import React, { createContext, useContext, useEffect, useState } from "react";
import type { PulseClient, ConnectionState, WelcomePayload } from "@pulse/client-sdk";
import type { PulseContextValue } from "./types";

const PulseContext = createContext<PulseContextValue | null>(null);

export interface PulseProviderProps {
  client: PulseClient;
  children: React.ReactNode;
}

/**
 * Root React Provider component that initializes and shares PulseClient state.
 * Listens to client connection lifecycle and synchronizes authenticated session info.
 *
 * @param props.client Initialized instance of PulseClient
 * @param props.children React component tree
 */
export const PulseProvider: React.FC<PulseProviderProps> = ({ client, children }) => {
  if (!client) {
    throw new Error("PulseProvider requires a valid PulseClient instance.");
  }

  const [connectionState, setConnectionState] = useState<ConnectionState>(() => client.getState());
  const [session, setSession] = useState<WelcomePayload | null>(() => client.getSession());

  useEffect(() => {
    // Synchronize initial state
    setConnectionState(client.getState());
    setSession(client.getSession());

    const unsubscribeState = client.on("state:change", (state: ConnectionState) => {
      setConnectionState(state);
    });

    const unsubscribeConnected = client.on("connected", (s: WelcomePayload) => {
      setSession(s);
    });

    const unsubscribeDisconnected = client.on("disconnected", () => {
      setSession(null);
    });

    return () => {
      unsubscribeState();
      unsubscribeConnected();
      unsubscribeDisconnected();
    };
  }, [client]);

  const value: PulseContextValue = {
    client,
    connectionState,
    session,
  };

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
};

/**
 * Hook to access the current PulseContextValue.
 * Throws an explicit error if used outside PulseProvider.
 *
 * @returns PulseContextValue containing client, connectionState, and session
 */
export function usePulseContext(): PulseContextValue {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error("usePulseContext must be used within a <PulseProvider>.");
  }
  return context;
}

