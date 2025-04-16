import Link from 'next/link';
import AuthButtons from '@/components/AuthButtons';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact Management App</h1>
          <AuthButtons />
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cloud-Based Contact Management</h2>
              <p className="text-gray-600 mb-6">
                A secure, efficient way to manage your contacts. Built with modern cloud technologies.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-blue-800 mb-2">Secure Storage</h3>
                  <p className="text-blue-600">Your contacts are stored securely in the cloud with encryption.</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-green-800 mb-2">Highly Available</h3>
                  <p className="text-green-600">Built on cloud infrastructure for maximum uptime and reliability.</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-purple-800 mb-2">Easy Management</h3>
                  <p className="text-purple-600">Simple interface to create, view, update, and delete your contacts.</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technical Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Cloud Architecture</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Platform as a Service (PaaS) model</li>
                    <li>Containerized with Docker</li>
                    <li>Microservices architecture</li>
                    <li>MongoDB Atlas cloud database</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Security</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Auth.js authentication and authorization</li>
                    <li>HTTPS encryption</li>
                    <li>JWT token-based security</li>
                    <li>Role-based access control</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Performance</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Optimized database queries</li>
                    <li>Auto-scaling infrastructure</li>
                    <li>Global CDN distribution</li>
                    <li>Caching strategies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Modern Stack</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Next.js for frontend and API</li>
                    <li>Prisma ORM for database access</li>
                    <li>TailwindCSS for styling</li>
                    <li>React server components</li>
                  </ul>
                </div>
              </div>
            </div>
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
