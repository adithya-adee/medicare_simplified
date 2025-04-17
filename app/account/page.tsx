import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { getUserById } from '@/lib/user';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/account');
  }

  const user = await getUserById(session.user.id);
  
  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
                {!user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-blue-100 h-full w-full flex items-center justify-center">
                    <span className="text-blue-600 text-2xl font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
            
            <nav className="space-y-1">
              <Link 
                href="/account" 
                className="block w-full py-2 px-3 text-left rounded-md bg-blue-50 text-blue-700 font-medium"
              >
                Profile
              </Link>
              <Link 
                href="/account/orders" 
                className="block w-full py-2 px-3 text-left rounded-md text-gray-700 hover:bg-gray-50"
              >
                My Orders
              </Link>
              <Link 
                href="/account/addresses" 
                className="block w-full py-2 px-3 text-left rounded-md text-gray-700 hover:bg-gray-50"
              >
                My Addresses
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="border rounded-md p-3 bg-gray-50">
                  {user.name || 'Not provided'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="border rounded-md p-3 bg-gray-50">
                  {user.email}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {user.emailVerified ? 'Verified' : 'Not verified'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Created
                </label>
                <div className="border rounded-md p-3 bg-gray-50">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="pt-4">
                <Link 
                  href="/account/edit"
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 