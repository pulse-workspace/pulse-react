import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/auth-store";
import { ConnectionIndicator, useI18n, useTheme, Avatar } from "@pulse/react-ui-kit";

/**
 * Global navigation header providing multi-page route navigation, theme/locale toggles, and user profile.
 */
export const Navbar: React.FC = () => {
  const { session, logout } = useAuth();
  const location = useLocation();
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const isConversations = location.pathname.startsWith("/conversations");
  const isSettings = location.pathname === "/settings";

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between z-20">
      {/* Brand & Nav Links */}
      <div className="flex items-center gap-6">
        <Link to="/conversations" className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
          <span className="text-xl">⚡</span>
          <span className="text-base tracking-tight text-gray-900 dark:text-white">Pulse Messenger</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/conversations"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isConversations
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {t("conversation.title")}
          </Link>
          <Link
            to="/settings"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isSettings
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* Controls & User Profile */}
      <div className="flex items-center gap-3">
        <ConnectionIndicator />

        {/* Locale Toggle */}
        <button
          type="button"
          onClick={() => setLocale(locale === "en" ? "vi" : "en")}
          className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Switch Language"
        >
          {locale.toUpperCase()}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {/* User Info & Logout */}
        {session && (
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
            <Avatar name={session.displayName || session.userId} size="sm" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
              {session.displayName || session.userId}
            </span>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-rose-500 hover:text-rose-700 ml-1 font-medium transition-colors"
              title="Sign Out"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

