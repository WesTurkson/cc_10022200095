"use client";

import { useAuth, logout } from '@/utils/client-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Client component for authentication buttons
 * Uses Auth.js for authentication
 */
export default function AuthButtons() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex gap-4">Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated && user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Welcome, {user.name}</span>
          <button
            onClick={() => logout('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
} 