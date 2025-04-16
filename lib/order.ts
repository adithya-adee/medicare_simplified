import { prisma } from './db';
import { Prisma, Order, OrderItem, Product, Address, User, OrderStatus } from '@prisma/client';
import { CartWithDetails } from './cart'; // Assuming cart functions are in ./cart

// Type definition for Order with details
export type OrderWithDetails = Order & {
  items: (OrderItem & { product: Product })[];
  address: Address;
  user: User;
};

// Create a new order from a cart
export const createOrderFromCart = async (userId: string, addressId: string, cart: CartWithDetails): Promise<Order> => {
  if (cart.items.length === 0) {
    throw new Error('Cannot create order from an empty cart');
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Use a transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // 1. Create the Order
    const order = await tx.order.create({
      data: {
        userId,
        addressId,
        total,
        status: OrderStatus.PENDING, // Default status
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // Store price at time of order
          })),
        },
      },
      include: { // Include items in the returned order object (optional)
        items: true,
      }
    });

    // 2. Clear the user's cart (optional, but common)
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    // 3. Update product stock (optional, depends on business logic)
    // for (const item of cart.items) {
    //   await tx.product.update({
    //     where: { id: item.productId },
    //     data: { stock: { decrement: item.quantity } },
    //   });
    // }

    return order;
  });
};

// Get an order by ID with details
export const getOrderById = async (orderId: string): Promise<OrderWithDetails | null> => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
      user: true, // Include user details
    },
  });
};

// Get all orders for a specific user
export const getUserOrders = async (userId: string): Promise<OrderWithDetails[]> => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

// Get all orders (potentially for admin)
export const getAllOrders = async (options?: {
  skip?: number;
  take?: number;
  where?: Prisma.OrderWhereInput;
  orderBy?: Prisma.OrderOrderByWithRelationInput;
}): Promise<OrderWithDetails[]> => {
  return prisma.order.findMany({
    ...options,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
      user: true,
    },
    orderBy: options?.orderBy ?? { createdAt: 'desc' }, // Default order
  });
}; 