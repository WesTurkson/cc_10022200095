/**
 * Client-side authentication utilities for Auth.js
 */

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react";

/**
 * Get the current user's session via Auth.js
 * This is for client components that need to check authentication state
 * @returns {function} useSession hook from next-auth/react
 */
export function useClientSession() {
  return useSession();
}

/**
 * Login the user with credentials
 * @param {Object} credentials - User credentials (email and password)
 * @param {string} callbackUrl - URL to redirect to after login
 */
export function login(credentials, callbackUrl = window.location.pathname) {
  return nextAuthSignIn("credentials", { 
    ...credentials,
    callbackUrl
  });
}

/**
 * Logout the user
 * @param {string} callbackUrl - URL to redirect to after logout
 */
export function logout(callbackUrl = '/') {
  return nextAuthSignOut({ callbackUrl });
}

/**
 * Shorthand to get the current session status
 * @returns {Object} Authentication data and helper properties
 */
export function useAuth() {
  const { data: session, status } = useSession();
  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user || null
  };
} 