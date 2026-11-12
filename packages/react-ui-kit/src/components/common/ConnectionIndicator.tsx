import React from "react";
import { useConnectionState } from "@pulse/react-hooks";
import { useI18n } from "../../i18n/context";

/**
 * Visual pill indicating current WebSocket gateway connection health.
 * Shows green for Connected, yellow for Reconnecting, red for Disconnected.
 */
export const ConnectionIndicator: React.FC = () => {
  const { state, isConnected, isReconnecting, isDisconnected } = useConnectionState();
  const { t } = useI18n();

  const config = (() => {
    if (isConnected) {
      return {
        dotClass: "bg-emerald-500",
        label: t("common.connected"),
        textClass: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
      };
    }
    if (isReconnecting) {
      return {
        dotClass: "bg-amber-500 animate-pulse",
        label: t("common.reconnecting"),
        textClass: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40",
      };
    }
    if (isDisconnected) {
      return {
        dotClass: "bg-rose-500",
        label: t("common.disconnected"),
        textClass: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40",
      };
    }
    return {
      dotClass: "bg-blue-500 animate-pulse",
      label: t("common.connecting"),
      textClass: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40",
    };
  })();

  return (
    <div
      title={`Status: ${state}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${config.textClass}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </div>
  );
};

