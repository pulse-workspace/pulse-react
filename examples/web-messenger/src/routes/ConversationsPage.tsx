import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConversations, ConversationList } from "@pulse/react-ui-kit";
import type { StoredConversation } from "@pulse/client-sdk";

/**
 * Conversations overview route (/conversations).
 * Displays full conversation list sidebar and empty detail viewport.
 */
export const ConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { conversations, loading } = useConversations();
  const [newChatId, setNewChatId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Navigates to active chat detail route.
   */
  const handleSelect = (conv: StoredConversation) => {
    navigate(`/conversations/${encodeURIComponent(conv.convID)}`);
  };

  /**
   * Starts a new chat by custom conversation ID.
   */
  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatId.trim()) return;
    navigate(`/conversations/${encodeURIComponent(newChatId.trim())}`);
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar List */}
      <div className="w-80 flex-shrink-0 flex flex-col h-full border-r border-gray-200 dark:border-gray-800">
        {/* Quick New Chat Bar */}
        <div className="p-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          {isCreating ? (
            <form onSubmit={handleStartChat} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={newChatId}
                onChange={(e) => setNewChatId(e.target.value)}
                placeholder="Enter Conv ID / User..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>+</span>
              <span>New Conversation</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            loading={loading}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* Empty State Viewport */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950 p-8 text-center">
        <div className="max-w-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-3xl flex items-center justify-center mx-auto mb-4">
            💬
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Select a conversation
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose an existing conversation from the list or start a new direct message thread.
          </p>
        </div>
      </div>
    </div>
  );
};
