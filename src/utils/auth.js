/**
 * Authentication utility functions for working with Auth.js in Next.js App Router
 */

import { auth, getCurrentUser } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

/**
 * Verify if a contact belongs to the requesting user
 * 
 * @param {string} contactId - The ID of the contact to verify
 * @returns {Promise<{contact: Object|null, error: string|null}>}
 */
export async function verifyContactOwnership(contactId) {
  try {
    // Get the current authenticated session
    const session = await auth();

    // If the user is not authenticated
    if (!session?.user) {
      return { 
        contact: null, 
        error: 'Unauthorized - User not authenticated' 
      };
    }

    // Get the user from database
    const user = await getCurrentUser();
    
    if (!user) {
      return { 
        contact: null, 
        error: 'User not found' 
      };
    }

    // Find the contact in the database
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    // If the contact doesn't exist
    if (!contact) {
      return { 
        contact: null, 
        error: 'Contact not found' 
      };
    }

    // If the contact doesn't belong to the current user
    if (contact.userId !== user.id) {
      return { 
        contact: null, 
        error: 'Unauthorized - Contact does not belong to the current user' 
      };
    }

    // Contact exists and belongs to the current user
    return { contact, error: null };
  } catch (err) {
    console.error('Error verifying contact ownership:', err);
    return { 
      contact: null, 
      error: 'Server error verifying contact ownership' 
    };
  }
}

/**
 * Check if the current user has a specific permission
 * @param {string} permission - The permission to check for
 * @returns {Promise<boolean>} - Whether the user has the permission
 */
export async function hasPermission(permission) {
  try {
    const user = await getCurrentUser();
    
    // If not authenticated, return false
    if (!user) {
      return false;
    }

    // Check if the user has the permission
    // This implementation will depend on how you store permissions
    // For example, you might store them in the user's roles or in a separate permissions table
    const userPermissions = await prisma.permission.findMany({
      where: {
        userId: user.id,
      },
    });

    return userPermissions.some(p => p.name === permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check if the current user has a specific role
 * @param {string} role - The role to check for
 * @returns {Promise<boolean>} - Whether the user has the role
 */
export async function hasRole(role) {
  try {
    const user = await getCurrentUser();
    
    // If not authenticated, return false
    if (!user) {
      return false;
    }

    // Check if the user has the role
    const userRoles = await prisma.role.findMany({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });

    return userRoles.some(r => r.name === role);
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
} 