import { prisma } from './db';
import { Prisma, Category, Product } from '@prisma/client';

export const createCategory = async (data: Prisma.CategoryCreateInput): Promise<Category> => {
  return prisma.category.create({ data });
};

export const getCategoryById = async (id: string): Promise<(Category & { products: Product[] }) | null> => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: true, // Include related products
    },
  });
};

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany();
};

export const updateCategory = async (id: string, data: Prisma.CategoryUpdateInput): Promise<Category> => {
  return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: string): Promise<Category> => {
  // Consider implications: products in this category might need re-categorization or deletion
  return prisma.category.delete({ where: { id } });
}; 