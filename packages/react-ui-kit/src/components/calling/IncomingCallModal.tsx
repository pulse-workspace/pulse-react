import React from "react";
import { useI18n } from "../../i18n/context";
import { Avatar } from "../common/Avatar";

/**
 * Properties for IncomingCallModal component.
 */
export interface IncomingCallModalProps {
  callerName: string;
  callerAvatar?: string;
  hasVideo?: boolean;
  onAccept: () => void;
  onDecline: () => void;
  className?: string;
}

/**
 * Incoming call ring alert modal with accept and decline actions.
 *
 * Business Logic:
 * Displays caller identity, vibrating/pulsing visual cue, and provides
 * callbacks for answering or rejecting incoming real-time audio/video calls.
 */
export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  callerName,
  callerAvatar,
  hasVideo = false,
  onAccept,
  onDecline,
  className = "",
}) => {
  const { t } = useI18n();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ${className}`}>
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-2xl text-center border border-gray-200 dark:border-gray-700 animate-scale-in">
        <div className="relative inline-block mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
          <Avatar
            name={callerName}
            src={callerAvatar}
            size="lg"
            className="relative z-10 mx-auto ring-4 ring-blue-500/30"
          />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {callerName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-8">
          {hasVideo ? t("call.incomingVideo") : t("call.incomingVoice")}
        </p>

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={onDecline}
            className="flex flex-col items-center gap-2 group cursor-pointer"
            aria-label={t("call.decline")}
          >
            <div className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition transform group-hover:scale-105">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.684A1 1 0 008.279 3H5z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {t("call.decline")}
            </span>
          </button>

          <button
            type="button"
            onClick={onAccept}
            className="flex flex-col items-center gap-2 group cursor-pointer"
            aria-label={t("call.accept")}
          >
            <div className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/30 transition transform group-hover:scale-105">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {t("call.accept")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
