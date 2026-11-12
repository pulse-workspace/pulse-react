import React, { useMemo, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth-store";
import { getAppConfig } from "../config/env";
import { PulseClient, IndexedDBAdapter } from "@pulse/client-sdk";
import { PulseChatProvider } from "@pulse/react-ui-kit";
import { Navbar } from "../components/Navbar";

/**
 * Primary layout for authenticated sessions.
 * Instantiates the singleton PulseClient, connects to Gateway, and provides the PulseChatProvider context.
 */
export const MainLayout: React.FC = () => {
  const { session, isAuthenticated } = useAuth();

  const client = useMemo(() => {
    if (!session) return null;

    const config = getAppConfig();
    return new PulseClient({
      gatewayUrl: config.pulseWsUrl,
      token: session.token,
      platform: "WEB",
      deviceId: session.deviceId,
      storage: new IndexedDBAdapter(`pulse_${session.userId}`, 1),
      heartbeatIntervalMs: 25000,
      reconnectBaseDelayMs: 1000,
      reconnectMaxDelayMs: 10000,
      maxReconnectAttempts: 10,
      handshakeTimeoutMs: 5000,
      ackTimeoutMs: 5000,
      typingStopDelayMs: 2500,
    });
  }, [session]);

  useEffect(() => {
    if (client) {
      client.connect().catch((err) => {
        // Log connection handshake error without breaking UI
        console.warn("PulseClient connection warning:", err);
      });

      return () => {
        client.disconnect();
      };
    }
  }, [client]);

  if (!isAuthenticated || !client) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PulseChatProvider client={client} initialLocale="en" initialThemeMode="system">
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    </PulseChatProvider>
  );
};
