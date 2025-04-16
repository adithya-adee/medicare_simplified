import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import CartItemControls from '@/components/cart/CartItemControls';
import EmptyCart from '@/components/cart/EmptyCart';
import CartSummary from '@/components/cart/CartSummary';
import { getCart } from '@/lib/actions';

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/cart');
  }

  const cart = await getCart(session.user.id);

  // Calculate cart totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // Apply discounts if applicable
  const discount = cart.items.reduce(
    (sum, item) => {
      if (item.product.discount) {
        return sum + (item.product.price * item.product.discount / 100) * item.quantity;
      }
      return sum;
    },
    0
  );
  
  const total = subtotal - discount;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border divide-y">
              {cart.items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                      {!item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-medium hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="text-sm text-gray-500 mb-2">
                      Category ID: {item.product.categoryId}
                    </div>
                    <div className="flex gap-2 items-center">
                      {item.product.discount ? (
                        <>
                          <span className="font-semibold">
                            ${((item.product.price - (item.product.price * item.product.discount / 100)) * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                            {item.product.discount}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="sm:self-end">
                    <CartItemControls 
                      cartItemId={item.id} 
                      quantity={item.quantity} 
                      maxQuantity={item.product.stock}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CartSummary 
            subtotal={subtotal} 
            discount={discount} 
            total={total} 
            itemCount={cart.items.length} 
          />
        </div>
      )}
    </div>
  );
} 