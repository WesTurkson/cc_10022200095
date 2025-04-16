import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();

    // Extract user data from request
    const { name, email, password } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Register user
    console.log(`Attempting to register user: ${email}`);
    const result = await registerUser({ name, email, password });

    if (result.error) {
      console.error(`User registration failed: ${result.error}`);
      
      // Check for specific error types
      if (result.error.includes("Database connection")) {
        return NextResponse.json(
          { error: result.error, details: "There appears to be a database connection issue. Please check your database configuration." },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log(`User successfully registered: ${email}`);
    // Return success response with user data
    return NextResponse.json(
      { user: result.user, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;
    
    if (error.message) {
      errorMessage = error.message;
      
      // If it's a parsing error
      if (error.message.includes('JSON')) {
        errorMessage = 'Invalid request format';
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined 
      },
      { status: statusCode }
    );
  }
} 