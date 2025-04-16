import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { getUserOrders } from '@/lib/order';
import { formatCurrency } from '@/lib/utils';

// Map OrderStatus to corresponding badge color
const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/account/orders');
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <nav className="space-y-1">
              <Link 
                href="/account" 
                className="block w-full py-2 px-3 text-left rounded-md text-gray-700 hover:bg-gray-50"
              >
                Profile
              </Link>
              <Link 
                href="/account/orders" 
                className="block w-full py-2 px-3 text-left rounded-md bg-blue-50 text-blue-700 font-medium"
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
          <div className="bg-white rounded-lg shadow-sm border">
            {orders.length > 0 ? (
              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Shipping Information</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.address.street}<br />
                          {order.address.city}, {order.address.state} {order.address.postalCode}<br />
                          {order.address.country}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Order Summary</p>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Total Items: {order.items.length}</p>
                          <p>Total: {formatCurrency(order.total)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Order Items</p>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center">
                            <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 mr-3">
                              {item.product.images && item.product.images.length > 0 ? (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <span className="text-xs text-gray-400">No image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm">{item.product.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} x {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {order.items.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Link 
                      href={`/account/orders/${order.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Order Details →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders with us.</p>
                <Link
                  href="/products"
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 