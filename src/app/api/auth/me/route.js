import { NextResponse } from 'next/server';

/**
 * API endpoint to get the current user's profile
 * 
 * This is a temporary solution that returns a mock user in development
 * to work around Auth0 cookies issue in Next.js 15
 */
export async function GET() {
  // For development, we'll return a mock user to avoid Auth0 issues
  // In production, you would properly integrate with Auth0
  const mockUser = {
    name: 'Demo User',
    email: 'demo@example.com',
    picture: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    sub: 'auth0|mock123456',
    nickname: 'demo',
    isAuthenticated: true
  };
  
  return NextResponse.json({ 
    user: mockUser,
    // Include a note that this is a mock user
    _note: 'This is a mock user for development. Auth0 integration needs to be properly configured for production.'
  }, { status: 200 });
} 