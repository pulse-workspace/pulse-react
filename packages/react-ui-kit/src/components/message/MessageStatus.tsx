import React from "react";
import type { MessageStatus as StatusType } from "@pulse/client-sdk";
import { useI18n } from "../../i18n/context";

export interface MessageStatusProps {
  status: StatusType;
}

/**
 * Message transmission status indicator (Pending/Sending, Sent, Failed).
 *
 * @param props.status Message delivery status code
 */
export const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  const { t } = useI18n();

  if (status === "PENDING") {
    return (
      <span className="text-[10px] text-gray-400 flex items-center gap-1" title={t("message.sending")}>
        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </span>
    );
  }

  if (status === "FAILED") {
    return (
      <span className="text-[10px] text-rose-500 flex items-center gap-0.5" title={t("message.failed")}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    );
  }

  // SENT
  return (
    <span className="text-[10px] text-indigo-400 dark:text-indigo-300" title={t("message.sent")}>
      <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
};

