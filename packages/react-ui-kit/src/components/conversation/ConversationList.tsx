import React, { useState, useMemo } from "react";
import type { StoredConversation } from "@pulse/client-sdk";
import { ConversationItem } from "./ConversationItem";
import { useI18n } from "../../i18n/context";

export interface ConversationListProps {
  conversations: StoredConversation[];
  selectedConvId?: string;
  onSelect: (conv: StoredConversation) => void;
  loading?: boolean;
}

/**
 * Filterable conversation sidebar list.
 * Supports quick search by title or ID and empty placeholder display.
 *
 * @param props.conversations Array of conversations
 * @param props.selectedConvId Currently active conversation ID
 * @param props.onSelect Callback when user selects a conversation
 * @param props.loading Loading state indicator
 */
export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConvId,
  onSelect,
  loading = false,
}) => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return conversations;
    const term = searchTerm.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title?.toLowerCase().includes(term) ||
        c.convID.toLowerCase().includes(term) ||
        c.lastMessage?.content?.text?.toLowerCase().includes(term)
    );
  }, [conversations, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header & Search */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("conversation.title")}
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("conversation.searchPlaceholder")}
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-400">
            {t("common.loading")}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 px-4 text-sm text-gray-400">
            {t("conversation.emptyList")}
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.convID}
              conversation={conv}
              isSelected={conv.convID === selectedConvId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};
