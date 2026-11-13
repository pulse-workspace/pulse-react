import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-store";

/**
 * Login route connecting user credentials and JWT token to the Pulse Gateway.
 * Strictly complies with Rule 8 (No mock data) and Rule 9 (Strict Light Mode).
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [customUserId, setCustomUserId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customToken, setCustomToken] = useState("");

  /**
   * Handles user authentication and connects to gateway session.
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUserId.trim() || !customToken.trim()) return;

    login({
      userId: customUserId.trim(),
      displayName: customName.trim() || customUserId.trim(),
      token: customToken.trim(),
      deviceId: `device_web_${customUserId.trim()}`,
    });
    navigate("/conversations");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Sign In to Pulse</h2>
        <p className="text-xs text-gray-500 mt-1">Authenticate using your gateway credentials and session token.</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            required
            value={customUserId}
            onChange={(e) => setCustomUserId(e.target.value)}
            placeholder="e.g. usr_12345"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g. Alex Hunter"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            JWT Session Token
          </label>
          <input
            type="password"
            required
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            placeholder="Enter client session JWT token"
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-500/20"
        >
          Connect to Gateway
        </button>
      </form>
    </div>
  );
};
