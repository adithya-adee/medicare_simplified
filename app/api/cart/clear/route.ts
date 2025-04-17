import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clearCart } from '@/lib/cart';

// POST /api/cart/clear - Clear all items from cart
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear the cart
    const cart = await clearCart(session.user.id);
    
    return NextResponse.json({ 
      items: cart.items,
      itemCount: cart.items.length,
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
} 