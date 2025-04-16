'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { updateCartItem, removeFromCart } from '@/lib/actions'; // Use server actions

interface CartItemControlsProps {
  cartItemId: string;
  quantity: number;
  maxQuantity: number;
}

export default function CartItemControls({ cartItemId, quantity, maxQuantity }: CartItemControlsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity) return;
    if (newQuantity === quantity) return;
    
    setIsLoading(true);
    try {
      const result = await updateCartItem(cartItemId, newQuantity);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const result = await removeFromCart(cartItemId);
      if (result.success) {
        toast.success('Item removed from cart');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center border rounded-md">
        <button
          className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isLoading}
        >
          -
        </button>
        <span className="px-3 py-1">{quantity}</span>
        <button
          className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= maxQuantity || isLoading}
        >
          +
        </button>
      </div>
      
      <button
        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
        onClick={handleRemove}
        disabled={isLoading}
      >
        Remove
      </button>
    </div>
  );
} 