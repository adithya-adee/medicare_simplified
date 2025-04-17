import { NextRequest, NextResponse } from 'next/server';
import { createOrderFromCart, getOrderById } from '@/lib/order';
import { getOrCreateCart, clearCart } from '@/lib/cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/orders - Create a new order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { addressId } = await req.json();
    
    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    // Get the user's cart
    const cart = await getOrCreateCart(session.user.id);
    
    if (cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Create order from cart
    const order = await createOrderFromCart(session.user.id, addressId, cart);
    
    // Retrieve the full order with details
    const orderWithDetails = await getOrderById(order.id);
    
    return NextResponse.json({ order: orderWithDetails }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get all orders for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // We'll implement this separately if needed
    return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 