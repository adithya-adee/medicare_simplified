import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateCartItemQuantity, removeItemFromCart, getOrCreateCart } from '@/lib/cart';

// Helper to get cart item ID from URL
function getCartItemId(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  return id || '';
}

// PATCH /api/cart/items/[id] - Update cart item quantity
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quantity } = await req.json();
    const cartItemId = getCartItemId(req);
    
    if (!cartItemId) {
      return NextResponse.json({ error: 'Cart item ID is required' }, { status: 400 });
    }

    // Update the item quantity
    await updateCartItemQuantity(cartItemId, quantity);
    
    // Fetch the updated cart
    const cart = await getOrCreateCart(session.user.id);
    
    return NextResponse.json({ 
      items: cart.items,
      itemCount: cart.items.length,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items/[id] - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItemId = getCartItemId(req);
    
    if (!cartItemId) {
      return NextResponse.json({ error: 'Cart item ID is required' }, { status: 400 });
    }

    // Delete the item
    await removeItemFromCart(cartItemId);
    
    // Fetch the updated cart
    const cart = await getOrCreateCart(session.user.id);
    
    return NextResponse.json({ 
      items: cart.items,
      itemCount: cart.items.length,
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
} 