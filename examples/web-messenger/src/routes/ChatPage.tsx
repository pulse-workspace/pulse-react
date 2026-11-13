import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-store";
import {
  useConversations,
  useMessages,
  useActiveTyping,
  ConversationList,
  ConversationHeader,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "@pulse/react-ui-kit";
import type { StoredConversation } from "@pulse/client-sdk";

/**
 * Dedicated chat detail route (/conversations/:conversationId).
 * Supports deep-linking, real-time message stream, typing debouncing, and optimistic dispatch.
 */
export const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const convId = conversationId || "";

  const { conversations, loading: convsLoading, markAsRead } = useConversations();
  const { messages, loading: msgsLoading, hasMore, loadMore, sendText } = useMessages(convId);
  const { typingUsers, setTyping } = useActiveTyping(convId);

  // Active conversation metadata from local list or synthetic stub
  const activeConversation: StoredConversation = useMemo(() => {
    const found = conversations.find((c) => c.convID === convId);
    if (found) return found;

    return {
      convID: convId,
      convType: 1,
      title: `Chat ${convId}`,
      unreadCount: 0,
      lastSeq: 0,
      updatedAt: Date.now(),
    };
  }, [conversations, convId]);

  // Mark as read when messages load or change
  useEffect(() => {
    if (convId && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.serverMsgID) {
        markAsRead(convId, lastMsg.serverMsgID).catch(() => {});
      }
    }
  }, [convId, messages, markAsRead]);

  /**
   * Switches conversation view.
   */
  const handleSelectConv = (conv: StoredConversation) => {
    navigate(`/conversations/${encodeURIComponent(conv.convID)}`);
  };

  /**
   * Dispatches text message.
   */
  const handleSendText = async (text: string) => {
    if (!text.trim()) return;
    await sendText(text);
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar List (Visible on tablet & desktop) */}
      <div className="hidden md:flex w-80 flex-shrink-0 flex-col h-full border-r border-gray-200 bg-white">
        <ConversationList
          conversations={conversations}
          selectedConvId={convId}
          loading={convsLoading}
          onSelect={handleSelectConv}
        />
      </div>

      {/* Active Chat Main Area */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Header */}
        <ConversationHeader
          conversation={activeConversation}
          isOnline={true}
        />

        {/* Message Stream */}
        <MessageList
          messages={messages}
          currentUserId={session?.userId || ""}
          hasMore={hasMore}
          loading={msgsLoading}
          onLoadMore={loadMore}
        />

        {/* Typing Notification Pill */}
        <TypingIndicator typingUsers={typingUsers} />

        {/* Input Bar */}
        <MessageInput
          onSend={handleSendText}
          onTyping={setTyping}
        />
      </div>
    </div>
  );
};

