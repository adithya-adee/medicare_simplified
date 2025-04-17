import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CartItem, Product } from '@prisma/client';

// Define the cart item type with product details
export type CartItemWithProduct = CartItem & {
  product: Product;
};

export function useCart() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate the total price of items in the cart
  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  // Fetch cart data from the API
  const fetchCart = async () => {
    if (!session?.user?.id) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      const data = await response.json();

      if (response.ok) {
        setCartItems(data.items || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch cart');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load your cart');
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh cart data (useful after cart modifications)
  const refreshCart = () => {
    fetchCart();
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        refreshCart();
        return true;
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update item');
        return false;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError('Failed to update item');
      return false;
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refreshCart();
        return true;
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to remove item');
        return false;
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      setError('Failed to remove item');
      return false;
    }
  };

  // Add item to cart
  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        refreshCart();
        return true;
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding cart item:', error);
      setError('Failed to add item to cart');
      return false;
    }
  };

  // Clear the cart
  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });

      if (response.ok) {
        refreshCart();
        return true;
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to clear cart');
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
      return false;
    }
  };

  // Load cart when session changes
  useEffect(() => {
    fetchCart();
  }, [session]);

  return {
    cartItems,
    total,
    isLoading,
    error,
    refreshCart,
    updateQuantity,
    removeItem,
    addItem,
    clearCart,
  };
} 