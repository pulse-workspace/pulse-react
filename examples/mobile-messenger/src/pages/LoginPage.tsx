import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { initializeClient } from "../services/client";

/**
 * Mobile Login Page for authenticating and establishing the WebSocket connection.
 *
 * Business Logic:
 * Accepts userId and auth token. Validates inputs, saves to localStorage,
 * establishes live connection via initializeClient(), and navigates to /conversations.
 */
export const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(() => localStorage.getItem("pulse_mobile_user_id") || "");
  const [token, setToken] = useState(() => localStorage.getItem("pulse_mobile_token") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !token.trim()) return;

    setLoading(true);
    setError(null);
    try {
      localStorage.setItem("pulse_mobile_user_id", userId.trim());
      localStorage.setItem("pulse_mobile_token", token.trim());

      await initializeClient(userId.trim(), token.trim());
      navigate("/conversations");
    } catch (err: any) {
      setError(err?.message || "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-200 dark:bg-gray-950 sm:py-6">
      <div className="w-full max-w-md h-screen sm:h-[844px] flex flex-col justify-between p-6 bg-white dark:bg-gray-900 shadow-2xl sm:rounded-3xl border border-gray-300 dark:border-gray-800">
        <div className="flex justify-end">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === "en" ? "vi" : "en")}
            className="text-xs px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
          >
            {i18n.language === "en" ? "VI" : "EN"}
          </button>
        </div>

        <div className="my-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {t("auth.title")}
          </h1>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1 mb-8">
            {t("auth.subtitle")}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                {t("auth.userIdLabel")}
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={t("auth.userIdPlaceholder")}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                {t("auth.tokenLabel")}
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={t("auth.tokenPlaceholder")}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
            >
              {loading ? "..." : t("auth.loginButton")}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-gray-400 dark:text-gray-600">
          Pulse Real-Time Architecture &copy; 2026
        </div>
      </div>
    </div>
  );
};

