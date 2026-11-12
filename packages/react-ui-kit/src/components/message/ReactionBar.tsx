import React from "react";

export interface ReactionBarProps {
  reactions?: Record<string, string[]>; // emoji -> array of userIDs
  currentUserId?: string;
  onReact: (emoji: string) => void;
}

const DEFAULT_EMOJIS = ["👍", "❤️", "😂", "🎉", "🔥", "🚀"];

/**
 * Reaction toolbar and reaction badge counts for a message.
 *
 * @param props.reactions Map of emoji to user ID list
 * @param props.currentUserId Active user ID to highlight reacted state
 * @param props.onReact Callback when an emoji is toggled
 */
export const ReactionBar: React.FC<ReactionBarProps> = ({
  reactions = {},
  currentUserId,
  onReact,
}) => {
  const activeEntries = Object.entries(reactions).filter(([, users]) => users.length > 0);

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      {/* Existing Reaction Badges */}
      {activeEntries.map(([emoji, users]) => {
        const hasReacted = currentUserId ? users.includes(currentUserId) : false;
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => onReact(emoji)}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-colors border ${
              hasReacted
                ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-950/60 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300"
                : "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <span>{emoji}</span>
            <span className="text-[10px] font-semibold">{users.length}</span>
          </button>
        );
      })}

      {/* Quick Add Reaction Popover Dropdown Button */}
      <div className="group relative inline-block">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full text-xs"
          title="React"
        >
          😀
        </button>
        <div className="hidden group-hover:flex items-center gap-1 absolute left-0 bottom-full mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg p-1 z-20">
          {DEFAULT_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onReact(emoji)}
              className="hover:scale-125 transition-transform p-1 text-sm"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

