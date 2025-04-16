import { prisma } from './db';
import { Prisma, Product, Category, Review } from '@prisma/client';

export const createProduct = async (data: Prisma.ProductCreateInput): Promise<Product> => {
  return prisma.product.create({ data });
};

export const getProductById = async (id: string): Promise<(Product & { category: Category; reviews: Review[] }) | null> => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: true, 
    },
  });
};

export const getAllProducts = async (options?: {
  skip?: number;
  take?: number;
  where?: Prisma.ProductWhereInput;
  orderBy?: Prisma.ProductOrderByWithRelationInput;
}): Promise<Product[]> => {
  return prisma.product.findMany({
    ...options,
    include: { category: true }, 
  });
};

export const getFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  return prisma.product.findMany({
    where: { featured: true },
    take: limit,
    include: { category: true }, 
  });
};

export const updateProduct = async (id: string, data: Prisma.ProductUpdateInput): Promise<Product> => {
  return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: string): Promise<Product> => {
  // Consider implications: related order items, cart items, reviews might need handling
  return prisma.product.delete({ where: { id } });
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: { category: true }, 
  });
};

// Function to get only products categorized as 'Medicine'
// Explicitly type the return value to include Category
export const getMedicines = async (): Promise<(Product & { category: Category })[]> => {
  return prisma.product.findMany({
    where: {
      category: {
        name: "Medicine", // Assumes category name is exactly 'Medicine'
      },
    },
    include: { category: true }, // Keep including category if needed elsewhere
  });
};

// You might add functions for filtering by category, price range, etc.
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return prisma.product.findMany({
    where: { categoryId },
    include: { category: true }, 
  });
}; 