import React from "react";
import { Link } from "react-router-dom";

/**
 * 404 Not Found fallback route view.
 * Styled with Light Mode per Rule 9.
 */
export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center bg-gray-50">
      <div className="max-w-md">
        <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The requested route does not exist or has been moved.
        </p>
        <Link
          to="/conversations"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          Return to Conversations
        </Link>
      </div>
    </div>
  );
};
