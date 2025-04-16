import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth, getCurrentUser, signOut } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

// Server component to fetch contacts
export default async function Dashboard() {
  // Get authenticated session
  const session = await auth();
  
  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }
  
  // Get user from database
  const user = await getCurrentUser();
  
  // If no user, redirect to home
  if (!user) {
    redirect('/');
  }
  
  // Fetch user's contacts
  const contacts = await prisma.contact.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            <Link href="/" className="hover:text-gray-700">
              Contact Management App
            </Link>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Welcome, {user.name}</span>
            <form action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Contacts</h2>
              <Link
                href="/contacts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add New Contact
              </Link>
            </div>
            
            {/* Contacts Table */}
            {contacts.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <Link 
                        href={`/contacts/${contact.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-800 font-medium">
                                  {contact.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-indigo-600">{contact.name}</p>
                                <p className="text-sm text-gray-500">{contact.email}</p>
                              </div>
                            </div>
                            <div>
                              {contact.phone && (
                                <p className="text-sm text-gray-500">
                                  📞 {contact.phone}
                                </p>
                              )}
                              {contact.company && (
                                <p className="text-sm text-gray-500">
                                  🏢 {contact.company}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                <p className="text-gray-500">No contacts found. Click &quot;Add New Contact&quot; to create your first contact.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Contact Management App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 