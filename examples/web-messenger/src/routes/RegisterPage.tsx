import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-store";

/**
 * User registration page route.
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");

  /**
   * Completes account registration and sets session.
   */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !displayName.trim()) return;

    login({
      userId: userId.trim(),
      displayName: displayName.trim(),
      token: `demo.jwt.${userId.trim()}.${Date.now()}`,
      deviceId: `device_web_${userId.trim()}`,
    });
    navigate("/conversations");
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Desired User ID
        </label>
        <input
          type="text"
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="username"
          className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <input
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-500/20"
      >
        Create Account
      </button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

