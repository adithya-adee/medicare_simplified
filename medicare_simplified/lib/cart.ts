import { prisma } from './db';
import { Prisma, Cart, CartItem, Product } from '@prisma/client';

// Type definition for Cart with items and product details
export type CartWithDetails = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

// Get or create a cart for a user
export const getOrCreateCart = async (userId: string): Promise<CartWithDetails> => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return cart;
};

// Add item to cart or update quantity
export const addItemToCart = async (userId: string, productId: string, quantity: number): Promise<CartWithDetails> => {
  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    // Update quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // Add new item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  // Re-fetch cart with updated items
  return getOrCreateCart(userId);
};

// Update item quantity in cart
export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<CartItem> => {
  if (quantity <= 0) {
    // If quantity is zero or less, remove the item
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

// Remove item from cart
export const removeItemFromCart = async (cartItemId: string): Promise<CartItem> => {
  return prisma.cartItem.delete({ where: { id: cartItemId } });
};

// Clear all items from a cart
export const clearCart = async (userId: string): Promise<CartWithDetails> => {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  // Re-fetch the empty cart
  return getOrCreateCart(userId);
}; 