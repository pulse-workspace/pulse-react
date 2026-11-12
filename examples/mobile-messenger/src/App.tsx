import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MobileLayout } from "./components/MobileLayout";
import { LoginPage } from "./pages/LoginPage";
import { ConversationsPage } from "./pages/ConversationsPage";
import { ChatRoomPage } from "./pages/ChatRoomPage";
import { SettingsPage } from "./pages/SettingsPage";

/**
 * Root Application Component configuring multi-page routes for Mobile Messenger.
 */
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Navigate to="/conversations" replace />} />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/conversations/:conversationId" element={<ChatRoomPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/conversations" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

