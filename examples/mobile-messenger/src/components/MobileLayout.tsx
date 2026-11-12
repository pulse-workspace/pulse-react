import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Mobile device frame wrapper with bottom navigation tabs.
 *
 * Business Logic:
 * Renders a mobile-width shell with sticky bottom tabs for 'Chats' and 'Settings'.
 * Highlights active tab according to current route location.
 */
export const MobileLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isConversations = location.pathname.startsWith("/conversations");
  const isSettings = location.pathname.startsWith("/settings");

  return (
    <div className="flex justify-center min-h-screen bg-gray-200 dark:bg-gray-950 sm:py-6">
      <div className="w-full max-w-md h-screen sm:h-[844px] flex flex-col bg-white dark:bg-gray-900 shadow-2xl sm:rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-800">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <nav className="h-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-around px-4">
          <button
            onClick={() => navigate("/conversations")}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition ${
              isConversations
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs">{t("nav.chats")}</span>
          </button>

          <button
            onClick={() => navigate("/settings")}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition ${
              isSettings
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">{t("nav.settings")}</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

