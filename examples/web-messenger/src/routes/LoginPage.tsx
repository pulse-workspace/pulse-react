import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-store";

const DEMO_ACCOUNTS = [
  { id: "usr_alice", name: "Alice Smith", role: "Product Manager" },
  { id: "usr_bob", name: "Bob Martin", role: "Lead Engineer" },
  { id: "usr_charlie", name: "Charlie Davis", role: "DevOps Architect" },
];

/**
 * Login route supporting instant single-click demo account testing or manual token entry.
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [customUserId, setCustomUserId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customToken, setCustomToken] = useState("");

  /**
   * Generates a mock or demo token session for immediate chat testing.
   */
  const handleQuickLogin = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    login({
      userId: account.id,
      displayName: account.name,
      token: `demo.jwt.${account.id}.${Date.now()}`,
      deviceId: `device_web_${account.id}`,
    });
    navigate("/conversations");
  };

  /**
   * Handles manual custom token authentication.
   */
  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUserId.trim()) return;

    login({
      userId: customUserId.trim(),
      displayName: customName.trim() || customUserId.trim(),
      token: customToken.trim() || `jwt.${customUserId.trim()}.${Date.now()}`,
      deviceId: `device_web_${customUserId.trim()}`,
    });
    navigate("/conversations");
  };

  return (
    <div className="space-y-6">
      {/* Quick Demo Switcher */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Select Demo Persona
        </label>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => handleQuickLogin(acc)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-left group"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {acc.name}
                </p>
                <p className="text-xs text-gray-500">{acc.role}</p>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Sign in →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-200 dark:border-gray-700 w-full" />
        <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-400 uppercase">Or custom ID</span>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleCustomLogin} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            User ID
          </label>
          <input
            type="text"
            required
            value={customUserId}
            onChange={(e) => setCustomUserId(e.target.value)}
            placeholder="e.g. user_99"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Name (Optional)
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g. Alex Hunter"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            JWT Token (Optional)
          </label>
          <input
            type="password"
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            placeholder="Auto-generated if empty"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-500/20"
        >
          Enter Chat Room
        </button>
      </form>
    </div>
  );
};

