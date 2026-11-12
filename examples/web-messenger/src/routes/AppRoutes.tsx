import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../auth/auth-store";
import { AuthLayout } from "../layouts/AuthLayout";
import { MainLayout } from "../layouts/MainLayout";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { ConversationsPage } from "./ConversationsPage";
import { ChatPage } from "./ChatPage";
import { SettingsPage } from "./SettingsPage";
import { NotFoundPage } from "./NotFoundPage";

/**
 * Root routing tree for Pulse Web Messenger.
 * Conforms to Rule 6: Multi-page router with URL deep-linking and browser navigation.
 */
export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Index Redirect */}
          <Route path="/" element={<Navigate to="/conversations" replace />} />

          {/* Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated Application Routes */}
          <Route element={<MainLayout />}>
            <Route path="/conversations" element={<ConversationsPage />} />
            <Route path="/conversations/:conversationId" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

