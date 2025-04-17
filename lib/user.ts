import { prisma } from './db';
import { Prisma, User } from '@prisma/client';

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({ data });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: string): Promise<User> => {
  return prisma.user.delete({ where: { id } });
};

// Example: Get user with related data
export const getUserWithRelations = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: true,
      reviews: true,
      cart: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
};

// Raw SQL equivalents
export const createUserRaw = async (data: Prisma.UserCreateInput): Promise<User> => {
  const user = await prisma.$queryRaw<User[]>`
    INSERT INTO "User" (${Prisma.raw(Object.keys(data).map(key => `"${key}"`).join(', '))})
    VALUES (${Prisma.join(Object.values(data).map(value => Prisma.sql`${value}`))})
    RETURNING *
  `;
  return user[0];
};

export const getUserByIdRaw = async (id: string): Promise<User | null> => {
  const users = await prisma.$queryRaw<User[]>`
    SELECT * FROM "User" WHERE id = ${id}
  `;
  return users.length > 0 ? users[0] : null;
};

export const getUserByEmailRaw = async (email: string): Promise<User | null> => {
  const users = await prisma.$queryRaw<User[]>`
    SELECT * FROM "User" WHERE email = ${email}
  `;
  return users.length > 0 ? users[0] : null;
};

export const updateUserRaw = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
  const setClause = Object.entries(data)
    .map(([key, value]) => `"${key}" = ${Prisma.sql`${value}`}`)
    .join(', ');
  
  const users = await prisma.$queryRaw<User[]>`
    UPDATE "User" SET ${Prisma.raw(setClause)} WHERE id = ${id} RETURNING *
  `;
  return users[0];
};

export const deleteUserRaw = async (id: string): Promise<User> => {
  const users = await prisma.$queryRaw<User[]>`
    DELETE FROM "User" WHERE id = ${id} RETURNING *
  `;
  return users[0];
};

export const getUserWithRelationsRaw = async (id: string) => {
  // For complex queries with relations, you might need multiple queries
  // or a more complex join query depending on your database
  
  // Get user
  const users = await prisma.$queryRaw<User[]>`
    SELECT * FROM "User" WHERE id = ${id}
  `;
  
  if (users.length === 0) return null;
  
  // Get addresses
  const addresses = await prisma.$queryRaw<any[]>`
    SELECT * FROM "Address" WHERE "userId" = ${id}
  `;
  
  // Get orders
  const orders = await prisma.$queryRaw<any[]>`
    SELECT * FROM "Order" WHERE "userId" = ${id}
  `;
  
  // Get reviews
  const reviews = await prisma.$queryRaw<any[]>`
    SELECT * FROM "Review" WHERE "userId" = ${id}
  `;
  
  // Get cart and items
  const carts = await prisma.$queryRaw<any[]>`
    SELECT * FROM "Cart" WHERE "userId" = ${id}
  `;
  
  const cartItems = carts.length > 0 
    ? await prisma.$queryRaw<any[]>`
        SELECT ci.*, p.* 
        FROM "CartItem" ci
        JOIN "Product" p ON ci."productId" = p.id
        WHERE ci."cartId" = ${carts[0].id}
      `
    : [];
  
  // Construct the result
  return {
    ...users[0],
    addresses,
    orders,
    reviews,
    cart: carts.length > 0 ? {
      ...carts[0],
      items: cartItems.map((item: any) => ({
        ...item,
        product: {
          id: item.id,
          name: item.name,
          // Add other product fields as needed
        }
      }))
    } : null
  };
}; 