import React, { useState, useRef, useCallback } from "react";
import { useI18n } from "../../i18n/context";

export interface MessageInputProps {
  onSend: (text: string) => Promise<void> | void;
  onTyping?: (isTyping: boolean) => void;
  onAttachClick?: () => void;
  disabled?: boolean;
}

/**
 * Chat input box with multiline support, keyboard shortcut dispatch, and typing signals.
 *
 * @param props.onSend Callback triggered on send
 * @param props.onTyping Callback to signal typing activity
 * @param props.onAttachClick Callback for file attachment trigger
 * @param props.disabled Input disable toggle
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  onAttachClick,
  disabled = false,
}) => {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Handles text changes and emits debounced typing signals.
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  /**
   * Dispatches the message if not empty.
   */
  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    if (onTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTyping(false);
    }

    onSend(trimmed);
    setText("");
  }, [text, disabled, onTyping, onSend]);

  /**
   * Submits on Enter, allows multiline on Shift+Enter.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-end gap-2">
      {onAttachClick && (
        <button
          type="button"
          onClick={onAttachClick}
          disabled={disabled}
          title="Attach file"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          📎
        </button>
      )}

      <textarea
        rows={1}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={t("message.inputPlaceholder")}
        className="flex-1 max-h-32 min-h-[2.5rem] py-2 px-3.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-medium transition-colors shadow-sm"
        title={t("common.send")}
      >
        <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  );
};

