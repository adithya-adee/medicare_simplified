'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart, CartItemWithProduct } from '@/hooks/useCart';
import { Address } from '@prisma/client';
import Link from 'next/link';
import axios from 'axios';

export default function CheckoutPage() {
  const { data: session } = useSession({ required: true });
  const { cartItems, total, isLoading, refreshCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user addresses
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await axios.get('/api/addresses');
        const data = response.data;
        setAddresses(data);
        
        // Automatically select the first address without requiring user selection
        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setError('Failed to load your shipping addresses');
      }
    }

    if (session?.user?.id) {
      fetchAddresses();
    }
  }, [session]);

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Order created successfully
      router.push(`/account/orders/${data.order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setError(typeof error === 'string' ? error : 'Failed to place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            
            {addresses.length === 0 ? (
              <div>
                <p className="mb-4">You don't have any saved addresses.</p>
                <Link href="/account/addresses/new" className="text-blue-600 hover:underline">
                  Add a new address
                </Link>
              </div>
            ) : (
              <div>
                <div className="mb-4 p-3 border rounded bg-gray-50">
                  {selectedAddressId && addresses.find(a => a.id === selectedAddressId) && (
                    <div>
                      <p className="font-medium">Selected Shipping Address:</p>
                      <p>
                        {addresses.find(a => a.id === selectedAddressId)?.street}, 
                        {addresses.find(a => a.id === selectedAddressId)?.city}, 
                        {addresses.find(a => a.id === selectedAddressId)?.state} 
                        {addresses.find(a => a.id === selectedAddressId)?.postalCode}
                      </p>
                    </div>
                  )}
                </div>
                <Link href="/account/addresses/new" className="text-blue-600 hover:underline">
                  Add a new address
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div className="divide-y">
                {cartItems.map((item: CartItemWithProduct) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Total</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || addresses.length === 0 || cartItems.length === 0}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 
                addresses.length === 0 ? 'Add an address to continue' : 
                cartItems.length === 0 ? 'Your cart is empty' : 
                'Place Order'}
            </button>
            <div className="mt-4 text-center">
              <Link href="/cart" className="text-blue-600 hover:underline">
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 