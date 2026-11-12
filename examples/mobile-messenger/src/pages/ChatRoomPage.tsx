import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getActiveClient } from "../services/client";
import { StoredMessage } from "@pulse/client-sdk";

/**
 * Mobile Chat Room Page for real-time messaging inside a conversation.
 *
 * Business Logic:
 * Loads cached conversation history from local storage adapter, subscribes to
 * real-time messages, marks messages as read, and supports optimistic sending.
 */
export const ChatRoomPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const client = getActiveClient();
  const currentUserId = client ? localStorage.getItem("pulse_mobile_user_id") || "" : "";

  useEffect(() => {
    if (!client || !conversationId) {
      navigate("/login");
      return;
    }

    // Load initial messages from offline storage
    client.message.getHistory(conversationId, 50).then((msgs: StoredMessage[]) => {
      setMessages(msgs);
      if (msgs.length > 0) {
        const latest = msgs[msgs.length - 1];
        if (latest.serverMsgID) client.conversation.markAsRead(conversationId, latest.serverMsgID);
      }
    });

    const handleMessage = (msg: StoredMessage) => {
      if (msg.convID === conversationId) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.clientMsgID !== msg.clientMsgID);
          return [...filtered, msg];
        });
        if (msg.serverMsgID) client.conversation.markAsRead(conversationId, msg.serverMsgID);
      }
    };

    const unsubNew = client.on("message:new", handleMessage);
    const unsubSent = client.on("message:sent", handleMessage);

    return () => {
      unsubNew();
      unsubSent();
    };
  }, [client, conversationId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !client || !conversationId) return;

    const text = inputText.trim();
    setInputText("");

    await client.message.sendText(conversationId, text);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <header className="p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate("/conversations")}
          className="p-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {conversationId}
          </h2>
          <span className="text-xs text-green-500 font-medium">Online</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMe = m.senderID === currentUserId;
          return (
            <div
              key={m.clientMsgID}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-xs"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-xs"
                }`}
              >
                {m.content?.text || ""}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                <span>{new Date(m.sendTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                {isMe && <span>• {m.status}</span>}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t("chat.inputPlaceholder")}
          className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};
