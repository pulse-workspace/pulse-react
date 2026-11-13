import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getActiveClient } from "../services/client";
import { StoredConversation } from "@pulse/client-sdk";

/**
 * Mobile Conversations Inbox Page.
 *
 * Business Logic:
 * Fetches stored conversations from the mobile client's conversation manager.
 * Provides modal/input to start a new chat with another user ID and navigates
 * to /conversations/:conversationId on item selection.
 * Styled with Light Mode per Rule 9.
 */
export const ConversationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [newChatUserId, setNewChatUserId] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    const client = getActiveClient();
    if (!client) {
      navigate("/login");
      return;
    }

    const refresh = () => {
      client.conversation.getConversations().then((list: StoredConversation[]) => {
        setConversations(list);
      });
    };

    refresh();

    const unsubNew = client.on("message:new", refresh);
    const unsubSent = client.on("message:sent", refresh);

    return () => {
      unsubNew();
      unsubSent();
    };
  }, [navigate]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    const target = newChatUserId.trim();
    if (!target) return;

    const convId = `dm_${target}`;
    setShowNewModal(false);
    setNewChatUserId("");
    navigate(`/conversations/${convId}`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
        <h1 className="text-xl font-bold text-slate-900">
          {t("chats.title")}
        </h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          title={t("chats.newChat")}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </header>

      {showNewModal && (
        <div className="p-4 bg-slate-50 border-b border-slate-200 animate-fade-in">
          <form onSubmit={handleStartChat} className="flex gap-2">
            <input
              type="text"
              value={newChatUserId}
              onChange={(e) => setNewChatUserId(e.target.value)}
              placeholder={t("chats.targetUserPlaceholder")}
              autoFocus
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
            >
              {t("chats.startChat")}
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm px-6 text-center">
            <svg className="w-12 h-12 mb-2 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {t("chats.empty")}
          </div>
        ) : (
          conversations.map((c) => (
            <div
              key={c.convID}
              onClick={() => navigate(`/conversations/${c.convID}`)}
              className="p-4 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-lg shrink-0">
                {(c.title || c.convID).slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-900 truncate text-sm">
                    {c.title || c.convID}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {new Date(c.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {c.lastMessage?.content?.text || ""}
                </p>
              </div>
              {c.unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                  {c.unreadCount}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
