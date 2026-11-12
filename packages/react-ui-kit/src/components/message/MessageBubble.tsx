import React from "react";
import type { StoredMessage } from "@pulse/client-sdk";
import { MessageStatus } from "./MessageStatus";
import { ReactionBar } from "./ReactionBar";

export interface MessageBubbleProps {
  message: StoredMessage;
  isMine: boolean;
  currentUserId?: string;
  onReact?: (emoji: string) => void;
}

/**
 * Message bubble component rendering text, image attachments, files, and transmission status.
 *
 * @param props.message Stored message entity
 * @param props.isMine Whether this message originated from the current authenticated user
 * @param props.currentUserId Active user identifier
 * @param props.onReact Callback when a reaction is triggered
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMine,
  currentUserId,
  onReact,
}) => {
  const timeFormatted = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  /**
   * Renders the message content according to its contentType.
   */
  const renderContent = () => {
    const content = message.content || {};

    // 102 = ContentImage
    if (message.contentType === 102 && content.url) {
      return (
        <div className="rounded-lg overflow-hidden max-w-sm mt-1">
          <img
            src={content.url}
            alt="Attachment"
            className="w-full h-auto object-cover max-h-72 rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
            loading="lazy"
          />
        </div>
      );
    }

    // 105 = ContentFile
    if (message.contentType === 105 && content.url) {
      return (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/10 hover:underline"
        >
          <span className="text-lg">📎</span>
          <div className="truncate">
            <p className="text-xs font-semibold truncate">{content.fileName || "File attachment"}</p>
            {content.size && <p className="text-[10px] opacity-75">{Math.round(content.size / 1024)} KB</p>}
          </div>
        </a>
      );
    }

    // Default: Plain text (101 = ContentText)
    return (
      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
        {content.text || message.clientMsgID}
      </p>
    );
  };

  return (
    <div className={`flex flex-col mb-3 select-text ${isMine ? "items-end" : "items-start"}`}>
      {/* Sender Header for Peer */}
      {!isMine && (
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium ml-2 mb-1">
          {message.senderID}
        </span>
      )}

      {/* Bubble Box */}
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl shadow-sm ${
          isMine
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700/80 rounded-bl-sm"
        }`}
      >
        {renderContent()}

        {/* Footer info: Timestamp & Delivery Status */}
        <div
          className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
            isMine ? "text-indigo-200" : "text-gray-400 dark:text-gray-500"
          }`}
        >
          <span>{timeFormatted}</span>
          {isMine && <MessageStatus status={message.status} />}
        </div>
      </div>

      {/* Reactions */}
      {onReact && (
        <ReactionBar
          currentUserId={currentUserId}
          onReact={onReact}
        />
      )}
    </div>
  );
};
