/**
 * Authenticated user session representation for Pulse Web Messenger.
 */
export interface UserSession {
  userId: string;
  displayName: string;
  token: string;
  deviceId: string;
}

export interface AuthContextValue {
  session: UserSession | null;
  login: (session: UserSession) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

