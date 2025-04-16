import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test the connection explicitly
    await prisma.$connect();
    
    // Try a simple query
    const count = await prisma.user.count();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection successful',
      userCount: count,
      databaseUrl: process.env.DATABASE_URL ? 'Configured (hidden)' : 'Not configured'
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    let errorDetails = error.message;
    let suggestion = '';
    
    // Provide helpful suggestions based on common errors
    if (error.message.includes('ECONNREFUSED')) {
      suggestion = 'Make sure your MongoDB server is running and accessible.';
    } else if (error.message.includes('Invalid DNS')) {
      suggestion = 'Check your DATABASE_URL for typos in the hostname.';
    } else if (error.message.includes('authentication failed')) {
      suggestion = 'Verify your database username and password.';
    } else if (error.message.includes('URI malformed')) {
      suggestion = 'Your DATABASE_URL format is incorrect. Please check the format.';
    }
    
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: errorDetails,
      suggestion,
      databaseUrl: process.env.DATABASE_URL ? 'Configured (hidden)' : 'Not configured'
    }, { status: 500 });
  } finally {
    // Always disconnect to clean up
    await prisma.$disconnect();
  }
} 