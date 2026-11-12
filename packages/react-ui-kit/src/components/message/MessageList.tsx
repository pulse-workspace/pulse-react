import React, { useEffect, useRef } from "react";
import type { StoredMessage } from "@pulse/client-sdk";
import { MessageBubble } from "./MessageBubble";
import { useI18n } from "../../i18n/context";

export interface MessageListProps {
  messages: StoredMessage[];
  currentUserId: string;
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  onReact?: (message: StoredMessage, emoji: string) => void;
}

/**
 * Message history scroll container with auto-scroll and infinite loading trigger.
 *
 * @param props.messages Ordered array of stored messages
 * @param props.currentUserId Active user ID to distinguish outbound vs inbound messages
 * @param props.hasMore Whether older messages can be paged
 * @param props.loading Loading spinner state
 * @param props.onLoadMore Callback to load previous page
 * @param props.onReact Callback when a reaction is added
 */
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  hasMore = false,
  loading = false,
  onLoadMore,
  onReact,
}) => {
  const { t } = useI18n();
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls smoothly to the most recent message at the bottom.
   */
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-950/40 flex flex-col justify-between"
    >
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mb-4">
          <button
            type="button"
            disabled={loading}
            onClick={onLoadMore}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors"
          >
            {loading ? t("common.loading") : "Load older messages"}
          </button>
        </div>
      )}

      {/* Empty State */}
      {messages.length === 0 && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-sm max-w-xs">{t("message.emptyHistory")}</p>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 space-y-1">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.clientMsgID}
            message={msg}
            isMine={msg.senderID === currentUserId}
            currentUserId={currentUserId}
            onReact={onReact ? (emoji) => onReact(msg, emoji) : undefined}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

