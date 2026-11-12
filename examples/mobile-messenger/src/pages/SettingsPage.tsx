import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerDevicePushToken } from "@pulse/react-native";
import { getAppConfig } from "../config/env";
import { logoutClient, getActiveClient } from "../services/client";

/**
 * Mobile Settings Page for push notification registration, theming and locale switching.
 *
 * Business Logic:
 * Provides interface to register push tokens (FCM/APNs) to backend push server,
 * switches display language between English and Vietnamese, and manages logout.
 */
export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [deviceToken, setDeviceToken] = useState("fcm_mock_token_mobile_789");
  const [pushStatus, setPushStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const client = getActiveClient();
  const userId = localStorage.getItem("pulse_mobile_user_id") || "Unknown";
  const token = localStorage.getItem("pulse_mobile_token") || "";

  const handleRegisterPush = async () => {
    if (!deviceToken.trim()) return;

    setLoading(true);
    setPushStatus(null);
    try {
      const config = getAppConfig();
      await registerDevicePushToken({
        apiUrl: config.apiUrl,
        token: token,
        pushToken: deviceToken.trim(),
        platform: "fcm",
        appBundleId: "com.pulse.mobile",
      });
      setPushStatus(t("settings.pushSuccess"));
    } catch (err: any) {
      setPushStatus(err?.message || t("settings.pushFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutClient();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-4 space-y-6">
      <header className="py-2 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("settings.title")}
        </h1>
      </header>

      <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
          {t("settings.deviceTokenTitle")}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t("settings.deviceTokenDesc")}
        </p>

        <div className="space-y-3">
          <input
            type="text"
            value={deviceToken}
            onChange={(e) => setDeviceToken(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
          />
          <button
            onClick={handleRegisterPush}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            {loading ? "..." : t("settings.registerPushToken")}
          </button>
          {pushStatus && (
            <p className="text-xs text-center font-medium text-blue-600 dark:text-blue-400">
              {pushStatus}
            </p>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">{t("settings.activeUser")}</span>
          <span className="text-xs font-mono font-semibold text-gray-900 dark:text-white">{userId}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">{t("settings.networkState")}</span>
          <span className="text-xs font-semibold text-green-500">
            {client ? client.getState() : "DISCONNECTED"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm text-gray-700 dark:text-gray-300">{t("settings.language")}</span>
          <div className="flex gap-1">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                i18n.language === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage("vi")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                i18n.language === "vi"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              VI
            </button>
          </div>
        </div>
      </section>

      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition border border-red-200 dark:border-red-800"
      >
        {t("auth.logoutButton")}
      </button>
    </div>
  );
};
