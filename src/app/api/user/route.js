import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

/**
 * GET handler for the /api/user endpoint
 * Returns the current user's information
 */
export async function GET() {
  try {
    // Get the authenticated user with database info
    const user = await getCurrentUser();

    // If not authenticated, return a 401 response
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to access this resource' },
        { status: 401 }
      );
    }

    // Return the user data (filtering out sensitive information)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Add any additional user fields you want to expose
    });
  } catch (error) {
    console.error('Error retrieving user information:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user information' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for the /api/user endpoint
 * Updates the current user's information
 */
export async function PATCH(request) {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();

    // If not authenticated, return a 401 response
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to update user information' },
        { status: 401 }
      );
    }

    // Parse the request body
    const updates = await request.json();

    // Fields that users are allowed to update
    const allowedFields = ['name', 'preferredLanguage', 'timezone', 'notification_preferences'];
    
    // Filter out any fields that aren't allowed to be updated
    const sanitizedUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // If there are no valid updates, return a 400 response
    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'Bad Request: No valid fields to update' },
        { status: 400 }
      );
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: sanitizedUpdates,
    });

    // Return the updated user data
    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        picture: updatedUser.picture,
        updatedAt: updatedUser.updatedAt,
        // Include any other updated fields that were modified
        ...Object.keys(sanitizedUpdates).reduce((obj, key) => {
          obj[key] = updatedUser[key];
          return obj;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Error updating user information:', error);
    return NextResponse.json(
      { error: 'Failed to update user information' },
      { status: 500 }
    );
  }
} 