'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

export default function CartSummary({ subtotal, discount, total, itemCount }: CartSummaryProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Redirect to checkout page
    router.push('/checkout');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({itemCount})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <button
        className={`w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors mb-3 ${
          isCheckingOut ? 'opacity-70 cursor-wait' : ''
        }`}
        onClick={handleCheckout}
        disabled={isCheckingOut}
      >
        {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
      </button>
      
      <Link
        href="/categories"
        className="w-full block text-center py-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
} 