'use server';

import { getOrCreateCart, addItemToCart, updateCartItemQuantity, removeItemFromCart, clearCart } from './cart';
import { revalidatePath } from 'next/cache';

// Wrapper functions for cart operations that can be called from client components

export async function addToCart(userId: string, productId: string, quantity: number) {
  try {
    await addItemToCart(userId, productId, quantity);
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  try {
    await updateCartItemQuantity(cartItemId, quantity);
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, error: 'Failed to update item quantity' };
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    await removeItemFromCart(cartItemId);
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: 'Failed to remove item from cart' };
  }
}

export async function emptyCart(userId: string) {
  try {
    await clearCart(userId);
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: 'Failed to clear cart' };
  }
}

// Function to get the cart - this would be called from server components
export async function getCart(userId: string) {
  try {
    return await getOrCreateCart(userId);
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
} 