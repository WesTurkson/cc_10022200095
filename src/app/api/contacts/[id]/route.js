import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyContactOwnership } from '@/utils/auth';

// GET /api/contacts/[id] - Get contact by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { contact, error } = await verifyContactOwnership(id);
    
    if (error) {
      return NextResponse.json(
        { error },
        { status: error.includes('not found') ? 404 : 401 }
      );
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/[id] - Update contact by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { contact, error } = await verifyContactOwnership(id);
    
    if (error) {
      return NextResponse.json(
        { error },
        { status: error.includes('not found') ? 404 : 401 }
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
    
    // Update the contact
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        address: data.address || null,
        notes: data.notes || null,
      },
    });
    
    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] - Delete contact by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { contact, error } = await verifyContactOwnership(id);
    
    if (error) {
      return NextResponse.json(
        { error },
        { status: error.includes('not found') ? 404 : 401 }
      );
    }
    
    // Delete the contact
    await prisma.contact.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
