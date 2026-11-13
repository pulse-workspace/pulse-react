import React from "react";
import { useAuth } from "../auth/auth-store";
import { useI18n, useConnectionState, ConnectionIndicator } from "@pulse/react-ui-kit";
import { getAppConfig } from "../config/env";

/**
 * Settings and telemetry configuration page (/settings).
 * Allows toggling application language (English/Vietnamese), reviewing connection state.
 * Strictly complies with Rule 9 (Strict Light Mode).
 */
export const SettingsPage: React.FC = () => {
  const { session, logout } = useAuth();
  const { locale, setLocale } = useI18n();
  const { state } = useConnectionState();
  const config = getAppConfig();

  return (
    <div className="h-full overflow-y-auto p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your account profile, preferences, and network connection.
        </p>
      </div>

      {/* Account Info */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Active Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs text-gray-400">User ID</span>
            <span className="font-mono font-medium text-gray-800">{session?.userId}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">Display Name</span>
            <span className="font-medium text-gray-800">{session?.displayName}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="block text-xs text-gray-400">Device ID</span>
            <span className="font-mono text-xs text-gray-600 break-all">{session?.deviceId}</span>
          </div>
        </div>
      </section>

      {/* Appearance & Language */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-base font-semibold text-gray-900">Preferences</h3>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language (Ngôn ngữ)
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                locale === "en"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              🇺🇸 English
            </button>
            <button
              type="button"
              onClick={() => setLocale("vi")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                locale === "vi"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
          </div>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appearance
          </label>
          <div className="flex gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700">
              ☀️ Light Mode (Enforced)
            </span>
          </div>
        </div>
      </section>

      {/* Network & Gateway Telemetry */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Gateway Telemetry</h3>
          <ConnectionIndicator />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs text-gray-400">Connection State</span>
            <span className="font-semibold text-indigo-600">{state}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">WebSocket Endpoint</span>
            <span className="font-mono text-xs text-gray-600 break-all">{config.pulseWsUrl}</span>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pt-2">
        <button
          type="button"
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-sm font-semibold hover:bg-rose-100 transition-colors"
        >
          Sign Out of Account
        </button>
      </section>
    </div>
  );
};
