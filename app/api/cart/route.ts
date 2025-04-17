import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrCreateCart } from '@/lib/cart';

// GET /api/cart - Get current user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await getOrCreateCart(session.user.id);
    
    return NextResponse.json({ 
      items: cart.items,
      itemCount: cart.items.length,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
} 