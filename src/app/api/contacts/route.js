import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth, getCurrentUser } from '@/lib/auth';

// GET /api/contacts - Get all contacts for the current user
export async function GET(request) {
  try {
    // Get authenticated user with Auth.js
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user from database
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const contacts = await prisma.contact.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request) {
  try {
    // Get authenticated user with Auth.js
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user from database
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    
    // Validation
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Upsert the contact (create if not exists, update if exists)
    const contact = await prisma.contact.upsert({
      where: {
        email: data.email, // Unique identifier to find the contact
      },
      update: { // Data to update if contact exists
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        address: data.address || null,
        notes: data.notes || null,
      },
      create: { // Data to create if contact does not exist
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        address: data.address || null,
        notes: data.notes || null,
        userId: user.id,
      },
    });
    
    return NextResponse.json(contact, { status: 200 }); // Status 200 for upsert
  } catch (error) {
    console.error('Error upserting contact:', error);
    // Upsert should prevent P2002, but handle just in case
    if (error.code === 'P2002') {
       return NextResponse.json(
        { error: 'Unique constraint violation during upsert.' },
        { status: 409 } // Conflict
      );
    }
    return NextResponse.json(
      { error: 'Failed to upsert contact' },
      { status: 500 }
    );
  }
}
