import { prisma } from './db';
import { Prisma, Category, Product } from '@prisma/client';

export const createCategory = async (data: Prisma.CategoryCreateInput): Promise<Category> => {
  // Insert the category with raw SQL
  await prisma.$executeRaw`
    INSERT INTO "Category" (
      "name", 
      "description", 
      "image", 
      "createdAt", 
      "updatedAt"
    ) VALUES (
      ${data.name},
      ${data.description || null},
      ${data.image || null},
      NOW(),
      NOW()
    )
  `;
  
  // Fetch the created category
  const createdCategory = await prisma.$queryRaw<Category[]>`
    SELECT * FROM "Category" 
    WHERE name = ${data.name}
    ORDER BY "createdAt" DESC 
    LIMIT 1
  `;
  
  return createdCategory[0];
};

export const getCategoryById = async (id: string): Promise<(Category & { products: Product[] }) | null> => {
  // Get the category
  const category = await prisma.$queryRaw<Category[]>`
    SELECT * FROM "Category" WHERE id = ${id}
  `;
  
  if (category.length === 0) {
    return null;
  }
  
  // Get related products
  const products = await prisma.$queryRaw<Product[]>`
    SELECT * FROM "Product" WHERE "categoryId" = ${id}
  `;
  
  // Combine the results
  return {
    ...category[0],
    products
  };
};

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.$queryRaw<Category[]>`
    SELECT * FROM "Category" ORDER BY name ASC
  `;
};

export const updateCategory = async (id: string, data: Prisma.CategoryUpdateInput): Promise<Category> => {
  // Update the category
  await prisma.$executeRaw`
    UPDATE "Category"
    SET
      "name" = COALESCE(${data.name}, "name"),
      "description" = COALESCE(${data.description}, "description"),
      "image" = COALESCE(${data.image}, "image"),
      "updatedAt" = NOW()
    WHERE id = ${id}
  `;
  
  // Get the updated category
  const updatedCategory = await prisma.$queryRaw<Category[]>`
    SELECT * FROM "Category" WHERE id = ${id}
  `;
  
  return updatedCategory[0];
};

export const deleteCategory = async (id: string): Promise<Category> => {
  // First, get the category we're about to delete
  const category = await prisma.$queryRaw<Category[]>`
    SELECT * FROM "Category" WHERE id = ${id}
  `;
  
  if (category.length === 0) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  // Then delete it
  await prisma.$executeRaw`
    DELETE FROM "Category" WHERE id = ${id}
  `;
  
  return category[0];
}; 