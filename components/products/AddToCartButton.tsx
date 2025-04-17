"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { addToCart } from "@/lib/actions";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!session?.user) {
      // If user is not logged in, redirect to login page
      return router.push('/auth/signin?callbackUrl=/products/' + productId);
    }

    setIsLoading(true);
    try {
      const result = await addToCart(session.user.id, productId, quantity);
      if (result.success) {
        toast.success('Product added to cart!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to add product to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add product to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center">
        <button
          className="px-3 py-1 border rounded-l-md"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-1 border-t border-b">{quantity}</span>
        <button
          className="px-3 py-1 border rounded-r-md"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </button>
      </div>
      
      <button
        className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
} 