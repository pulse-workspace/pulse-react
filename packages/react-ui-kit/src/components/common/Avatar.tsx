import React from "react";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  className?: string;
}

/**
 * Renders an avatar image with fallback monogram initials and presence badge.
 *
 * @param props.src Optional image URL
 * @param props.name User or group display name
 * @param props.size Sizing variant ('sm', 'md', 'lg')
 * @param props.isOnline Whether the user is currently online
 * @param props.className Optional additional CSS classes
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  isOnline,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }[size];

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses} rounded-full object-cover border border-gray-200 dark:border-gray-700`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-medium flex items-center justify-center select-none shadow-sm`}
        >
          {initials || "?"}
        </div>
      )}
      {typeof isOnline === "boolean" && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900 ${
            size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"
          } ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}
        />
      )}
    </div>
  );
};

