import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerDevicePushToken } from "@pulse/react-native";
import { getAppConfig } from "../config/env";
import { logoutClient, getActiveClient } from "../services/client";

/**
 * Mobile Settings Page for push notification registration and locale switching.
 *
 * Business Logic:
 * Provides interface to register push tokens (FCM/APNs) to backend push server,
 * switches display language between English and Vietnamese, and manages logout.
 * Styled with Light Mode per Rule 9.
 */
export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [deviceToken, setDeviceToken] = useState("");
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
    <div className="flex flex-col h-full bg-slate-50 p-4 space-y-6">
      <header className="py-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          {t("settings.title")}
        </h1>
      </header>

      <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 mb-1">
          {t("settings.deviceTokenTitle")}
        </h2>
        <p className="text-xs text-slate-500 mb-3">
          {t("settings.deviceTokenDesc")}
        </p>

        <div className="space-y-3">
          <input
            type="text"
            value={deviceToken}
            onChange={(e) => setDeviceToken(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleRegisterPush}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            {loading ? "..." : t("settings.registerPushToken")}
          </button>
          {pushStatus && (
            <p className="text-xs text-center font-medium text-blue-600">
              {pushStatus}
            </p>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">{t("settings.activeUser")}</span>
          <span className="text-xs font-mono font-semibold text-slate-900">{userId}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">{t("settings.networkState")}</span>
          <span className="text-xs font-semibold text-emerald-600">
            {client ? client.getState() : "DISCONNECTED"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-sm text-slate-700">{t("settings.language")}</span>
          <div className="flex gap-1">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                i18n.language === "en"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage("vi")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                i18n.language === "vi"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              VI
            </button>
          </div>
        </div>
      </section>

      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-2xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition border border-red-200"
      >
        {t("auth.logoutButton")}
      </button>
    </div>
  );
};
