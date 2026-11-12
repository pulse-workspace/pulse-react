import React from "react";
import { useI18n } from "../../i18n/context";
import { Avatar } from "../common/Avatar";

/**
 * Properties for ActiveCallOverlay component.
 */
export interface ActiveCallOverlayProps {
  remoteParticipantName: string;
  remoteAvatar?: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing?: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare?: () => void;
  onHangup: () => void;
  remoteVideoRef?: React.RefObject<HTMLVideoElement>;
  localVideoRef?: React.RefObject<HTMLVideoElement>;
  className?: string;
}

/**
 * Interactive audio/video active calling interface with floating control dock.
 *
 * Business Logic:
 * Renders live WebRTC remote track / avatar placeholder, local camera preview pip,
 * and controls for mute/unmute, video toggle, screen sharing, and hangup.
 */
export const ActiveCallOverlay: React.FC<ActiveCallOverlayProps> = ({
  remoteParticipantName,
  remoteAvatar,
  isMuted,
  isVideoEnabled,
  isScreenSharing = false,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onHangup,
  remoteVideoRef,
  localVideoRef,
  className = "",
}) => {
  const { t } = useI18n();

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-gray-950 text-white ${className}`}>
      {/* Remote Video / Avatar Container */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {remoteVideoRef ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <Avatar name={remoteParticipantName} src={remoteAvatar} size="lg" className="w-24 h-24 text-2xl" />
            <h2 className="text-xl font-semibold tracking-wide">{remoteParticipantName}</h2>
          </div>
        )}

        {/* Local Video Picture-in-Picture */}
        {isVideoEnabled && (
          <div className="absolute bottom-24 right-6 w-36 h-48 sm:w-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gray-900 z-10">
            {localVideoRef && (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            )}
          </div>
        )}
      </div>

      {/* Control Dock */}
      <div className="h-24 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4 px-6 z-20">
        <button
          type="button"
          onClick={onToggleMute}
          className={`p-3.5 rounded-full transition ${
            isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30 backdrop-blur"
          }`}
          title={isMuted ? t("call.unmute") : t("call.mute")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMuted ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z M3 3l18 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            )}
          </svg>
        </button>

        <button
          type="button"
          onClick={onToggleVideo}
          className={`p-3.5 rounded-full transition ${
            !isVideoEnabled ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30 backdrop-blur"
          }`}
          title={isVideoEnabled ? t("call.videoOff") : t("call.videoOn")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isVideoEnabled ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z M3 3l18 18" />
            )}
          </svg>
        </button>

        {onToggleScreenShare && (
          <button
            type="button"
            onClick={onToggleScreenShare}
            className={`p-3.5 rounded-full transition ${
              isScreenSharing ? "bg-blue-600 hover:bg-blue-700" : "bg-white/20 hover:bg-white/30 backdrop-blur"
            }`}
            title={isScreenSharing ? t("call.stopShare") : t("call.screenShare")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={onHangup}
          className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition transform hover:scale-105"
          title={t("call.hangup")}
        >
          <svg className="w-6 h-6 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
