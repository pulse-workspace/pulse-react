/**
 * Translation key definitions for UI Kit components.
 */
export interface TranslationDictionary {
  common: {
    connecting: string;
    connected: string;
    disconnected: string;
    reconnecting: string;
    loading: string;
    retry: string;
    cancel: string;
    send: string;
  };
  conversation: {
    title: string;
    searchPlaceholder: string;
    emptyList: string;
    unread: string;
    group: string;
    direct: string;
  };
  message: {
    inputPlaceholder: string;
    typingSingle: string;
    typingMultiple: string;
    sending: string;
    sent: string;
    failed: string;
    read: string;
    emptyHistory: string;
  };
  call: {
    incomingVoice: string;
    incomingVideo: string;
    accept: string;
    decline: string;
    hangup: string;
    mute: string;
    unmute: string;
    videoOn: string;
    videoOff: string;
    screenShare: string;
    stopShare: string;
  };
}

export type SupportedLocale = "en" | "vi";

