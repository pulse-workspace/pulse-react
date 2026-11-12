import React, { createContext, useContext, useState, useEffect } from "react";
import type { UserSession, AuthContextValue } from "./types";

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "pulse_web_messenger_session";

export interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Manages user authentication state and persists credentials in localStorage.
 *
 * @param props.children React component subtree
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = (newSession: UserSession) => {
    setSession(newSession);
  };

  const logout = () => {
    setSession(null);
  };

  const value: AuthContextValue = {
    session,
    login,
    logout,
    isAuthenticated: session !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Accesses user authentication session context.
 *
 * @returns AuthContextValue
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
}

