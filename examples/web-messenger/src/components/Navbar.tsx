import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/auth-store";
import { ConnectionIndicator, useI18n, Avatar } from "@pulse/react-ui-kit";

/**
 * Global navigation header providing multi-page route navigation, locale toggles, and user profile.
 * Strictly complies with Rule 9 (Strict Light Mode).
 */
export const Navbar: React.FC = () => {
  const { session, logout } = useAuth();
  const location = useLocation();
  const { locale, setLocale, t } = useI18n();

  const isConversations = location.pathname.startsWith("/conversations");
  const isSettings = location.pathname === "/settings";

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-20">
      {/* Brand & Nav Links */}
      <div className="flex items-center gap-6">
        <Link to="/conversations" className="flex items-center gap-2 font-bold text-indigo-600">
          <span className="text-xl">⚡</span>
          <span className="text-base tracking-tight text-gray-900 font-bold">Pulse Messenger</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/conversations"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isConversations
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {t("conversation.title")}
          </Link>
          <Link
            to="/settings"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isSettings
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
          className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
          title="Switch Language"
        >
          {locale.toUpperCase()}
        </button>

        {/* User Info & Logout */}
        {session && (
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <Avatar name={session.displayName || session.userId} size="sm" />
            <span className="text-xs font-medium text-gray-700 hidden sm:inline">
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
