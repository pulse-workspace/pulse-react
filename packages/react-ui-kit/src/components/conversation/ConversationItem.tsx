import React from "react";
import type { StoredConversation } from "@pulse/client-sdk";
import { Avatar } from "../common/Avatar";
import { Badge } from "../common/Badge";

export interface ConversationItemProps {
  conversation: StoredConversation;
  isSelected: boolean;
  onSelect: (conv: StoredConversation) => void;
}

/**
 * Single conversation tile within ConversationList.
 * Displays avatar, title, last message snippet, timestamp, and unread badge.
 *
 * @param props.conversation Stored conversation entity
 * @param props.isSelected Boolean indicating if currently opened
 * @param props.onSelect Selection handler callback
 */
export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
}) => {
  const timeString = conversation.updatedAt
    ? new Date(conversation.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const snippet =
    conversation.lastMessage?.content?.text ||
    (conversation.lastMessage ? "Attachment" : "No messages yet");

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-colors duration-150 select-none ${
        isSelected
          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
      }`}
    >
      <Avatar name={conversation.title || conversation.convID} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold truncate">
            {conversation.title || `Chat ${conversation.convID.slice(0, 8)}`}
          </h4>
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
            {timeString}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {snippet}
          </p>
          <Badge count={conversation.unreadCount} variant="primary" />
        </div>
      </div>
    </button>
  );
};
