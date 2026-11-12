import type { TranslationDictionary } from "./types";

/**
 * English translation dictionary for Pulse UI Kit.
 */
export const enTranslations: TranslationDictionary = {
  common: {
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    reconnecting: "Reconnecting...",
    loading: "Loading...",
    retry: "Retry",
    cancel: "Cancel",
    send: "Send",
  },
  conversation: {
    title: "Conversations",
    searchPlaceholder: "Search conversations...",
    emptyList: "No conversations found",
    unread: "unread",
    group: "Group",
    direct: "Direct Message",
  },
  message: {
    inputPlaceholder: "Type a message...",
    typingSingle: "is typing...",
    typingMultiple: "are typing...",
    sending: "Sending...",
    sent: "Sent",
    failed: "Failed to send",
    read: "Read",
    emptyHistory: "No messages yet. Send a greeting to start chatting!",
  },
  call: {
    incomingVoice: "Incoming Voice Call...",
    incomingVideo: "Incoming Video Call...",
    accept: "Accept",
    decline: "Decline",
    hangup: "End Call",
    mute: "Mute",
    unmute: "Unmute",
    videoOn: "Start Video",
    videoOff: "Stop Video",
    screenShare: "Share Screen",
    stopShare: "Stop Sharing",
  },
};

