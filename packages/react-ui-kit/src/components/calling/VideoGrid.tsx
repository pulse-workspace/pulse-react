import React from "react";
import { Avatar } from "../common/Avatar";

/**
 * Information for a participant in the video grid.
 */
export interface GridParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  isSpeaking?: boolean;
  isMuted?: boolean;
  videoElement?: React.ReactNode;
}

/**
 * Properties for VideoGrid component.
 */
export interface VideoGridProps {
  participants: GridParticipant[];
  className?: string;
}

/**
 * Responsive multi-participant video conference grid.
 *
 * Business Logic:
 * Calculates optimal grid columns (1x1, 1x2, 2x2, 3x3) based on participant count,
 * highlights actively speaking participants with an animated border, and falls
 * back to user avatars when video stream is unavailable or turned off.
 */
export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  className = "",
}) => {
  const count = participants.length;
  let gridCols = "grid-cols-1";
  if (count === 2) gridCols = "grid-cols-1 sm:grid-cols-2";
  else if (count >= 3 && count <= 4) gridCols = "grid-cols-2";
  else if (count > 4) gridCols = "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-3 w-full h-full p-4 bg-gray-950 ${className}`}>
      {participants.map((p) => (
        <div
          key={p.id}
          className={`relative rounded-2xl overflow-hidden bg-gray-900 border flex items-center justify-center transition ${
            p.isSpeaking ? "border-green-500 shadow-lg shadow-green-500/20" : "border-gray-800"
          }`}
        >
          {p.videoElement ? (
            p.videoElement
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar name={p.name} src={p.avatarUrl} size="lg" />
              <span className="text-xs font-medium text-gray-300">{p.name}</span>
            </div>
          )}

          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[11px] font-medium text-white flex items-center gap-1.5">
            <span>{p.name}</span>
            {p.isMuted && (
              <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

