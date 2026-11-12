import React from "react";
import { useI18n } from "../../i18n/context";

export interface TypingIndicatorProps {
  typingUsers: string[];
}

/**
 * Animated typing bubble showing which users are currently composing messages.
 *
 * @param props.typingUsers Array of typing user IDs/names
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  const { t } = useI18n();

  if (!typingUsers || typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} ${t("message.typingSingle")}`
      : `${typingUsers.length} users ${t("message.typingMultiple")}`;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-500 dark:text-gray-400 bg-transparent animate-fade-in">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
};

