import React from "react";
import type { StoredConversation } from "@pulse/client-sdk";
import { Avatar } from "../common/Avatar";
import { ConnectionIndicator } from "../common/ConnectionIndicator";

export interface ConversationHeaderProps {
  conversation?: StoredConversation | null;
  typingSubtitle?: string;
  isOnline?: boolean;
}

/**
 * Top header banner for active conversation view.
 * Displays target user/group name, active typing status, and gateway connection badge.
 *
 * @param props.conversation Currently active conversation
 * @param props.typingSubtitle Subtitle string (e.g. 'Alice is typing...')
 * @param props.isOnline Whether the peer is currently online
 */
export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  typingSubtitle,
  isOnline,
}) => {
  if (!conversation) {
    return (
      <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
        <span className="text-sm text-gray-400">Select a conversation to start</span>
        <ConnectionIndicator />
      </div>
    );
  }

  return (
    <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          name={conversation.title || conversation.convID}
          size="md"
          isOnline={isOnline}
        />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {conversation.title || `Conversation ${conversation.convID.slice(0, 8)}`}
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
            {typingSubtitle || `ID: ${conversation.convID}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ConnectionIndicator />
      </div>
    </div>
  );
};

