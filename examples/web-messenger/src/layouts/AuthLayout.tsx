import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth-store";

/**
 * Layout container for unauthenticated views (Login, Register).
 * Automatically redirects to /conversations if an active user session exists.
 * Styled with Light Mode per Rule 9.
 */
export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/conversations" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white text-2xl font-bold shadow-lg shadow-indigo-500/30 mb-3">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pulse Messenger</h1>
          <p className="text-sm text-gray-500 mt-1">Real-Time Chat & Collaboration</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
