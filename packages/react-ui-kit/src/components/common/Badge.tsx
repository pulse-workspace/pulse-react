import React from "react";

export interface BadgeProps {
  count?: number;
  text?: string;
  variant?: "primary" | "secondary" | "danger" | "success";
}

/**
 * Visual badge for notification counters and tags.
 *
 * @param props.count Number to display in counter pill
 * @param props.text Optional string text to display
 * @param props.variant Styling theme variant
 */
export const Badge: React.FC<BadgeProps> = ({
  count,
  text,
  variant = "primary",
}) => {
  if (count === undefined && !text) return null;
  if (count !== undefined && count <= 0) return null;

  const variantClasses = {
    primary: "bg-indigo-600 text-white",
    secondary: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    danger: "bg-rose-500 text-white",
    success: "bg-emerald-500 text-white",
  }[variant];

  const display = count !== undefined ? (count > 99 ? "99+" : count) : text;

  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full min-w-[1.25rem] h-5 ${variantClasses}`}
    >
      {display}
    </span>
  );
};

