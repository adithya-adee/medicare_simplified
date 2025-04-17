import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addItemToCart } from '@/lib/cart';

// POST /api/cart/items - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await req.json();
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const cart = await addItemToCart(
      session.user.id, 
      productId, 
      quantity || 1
    );
    
    return NextResponse.json({ 
      items: cart.items,
      itemCount: cart.items.length,
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
} 