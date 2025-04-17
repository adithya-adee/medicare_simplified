import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById } from '@/lib/order';
import { formatCurrency } from '@/lib/utils';

// Map OrderStatus to corresponding badge color
const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function OrderDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/account/orders');
  }

  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  // Verify the order belongs to the logged-in user
  if (order.userId !== session.user.id) {
    redirect('/account/orders');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/account/orders" className="text-blue-600 hover:text-blue-800">
          ← Back to Orders
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">Order #{order.id.substring(0, 8)}</h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
            {order.status}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-medium mb-2">Shipping Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-1">{order.user.name}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
              <p>{order.address.country}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-1">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 mt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-4">Order Items</h3>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4">
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
                  <Link 
                    href={`/products/${item.product.id}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-gray-500">
                    Quantity: {item.quantity}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total: {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Link 
          href="/account/orders"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Orders
        </Link>
        
        {order.status === 'PENDING' && (
          <button 
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
} 