/**
 * Public entrypoint for @pulse/react-ui-kit.
 */

// High-level Provider
export { PulseChatProvider } from "./PulseChatProvider";
export type { PulseChatProviderProps } from "./PulseChatProvider";

// Components - Common
export { Avatar } from "./components/common/Avatar";
export type { AvatarProps } from "./components/common/Avatar";
export { Badge } from "./components/common/Badge";
export type { BadgeProps } from "./components/common/Badge";
export { ConnectionIndicator } from "./components/common/ConnectionIndicator";

// Components - Conversation
export { ConversationItem } from "./components/conversation/ConversationItem";
export type { ConversationItemProps } from "./components/conversation/ConversationItem";
export { ConversationList } from "./components/conversation/ConversationList";
export type { ConversationListProps } from "./components/conversation/ConversationList";
export { ConversationHeader } from "./components/conversation/ConversationHeader";
export type { ConversationHeaderProps } from "./components/conversation/ConversationHeader";

// Components - Message
export { MessageBubble } from "./components/message/MessageBubble";
export type { MessageBubbleProps } from "./components/message/MessageBubble";
export { MessageList } from "./components/message/MessageList";
export type { MessageListProps } from "./components/message/MessageList";
export { MessageStatus } from "./components/message/MessageStatus";
export type { MessageStatusProps } from "./components/message/MessageStatus";
export { ReactionBar } from "./components/message/ReactionBar";
export type { ReactionBarProps } from "./components/message/ReactionBar";

// Components - Input
export { MessageInput } from "./components/input/MessageInput";
export type { MessageInputProps } from "./components/input/MessageInput";
export { TypingIndicator } from "./components/input/TypingIndicator";
export type { TypingIndicatorProps } from "./components/input/TypingIndicator";

// Components - Calling & WebRTC
export { IncomingCallModal } from "./components/calling/IncomingCallModal";
export type { IncomingCallModalProps } from "./components/calling/IncomingCallModal";
export { ActiveCallOverlay } from "./components/calling/ActiveCallOverlay";
export type { ActiveCallOverlayProps } from "./components/calling/ActiveCallOverlay";
export { VideoGrid } from "./components/calling/VideoGrid";
export type { VideoGridProps, GridParticipant } from "./components/calling/VideoGrid";

// Theming
export { ThemeProvider, useTheme } from "./theme/context";
export type { ThemeMode, ThemeContextValue } from "./theme/types";

// i18n
export { I18nProvider, useI18n } from "./i18n/context";
export type { SupportedLocale, TranslationDictionary } from "./i18n/types";

// Re-export headless hooks
export * from "@pulse/react-hooks";

