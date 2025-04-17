import { prisma } from './db';
import { Prisma, Product, Category, Review } from '@prisma/client';

export const createProduct = async (data: Prisma.ProductCreateInput): Promise<Product> => {
  // Convert create to an INSERT statement
  const result = await prisma.$executeRaw`
    INSERT INTO "Product" (
      "name", 
      "description", 
      "price", 
      "stock", 
      "featured", 
      "discount", 
      "categoryId", 
      "images", 
      "createdAt", 
      "updatedAt"
    ) VALUES (
      ${data.name},
      ${data.description || null},
      ${data.price},
      ${data.stock || 0},
      ${data.featured || false},
      ${data.discount || null},
      ${data.category?.connect?.id || null},
      ${data.images || []},
      NOW(),
      NOW()
    ) RETURNING *
  `;
  
  // Since $executeRaw doesn't return the created record directly,
  // we need to fetch it manually
  const createdProduct = await prisma.$queryRaw<Product[]>`
    SELECT * FROM "Product" 
    ORDER BY "createdAt" DESC 
    LIMIT 1
  `;
  
  return createdProduct[0];
};

export const getProductById = async (id: string): Promise<(Product & { category: Category; reviews: Review[] }) | null> => {
  // Get product with its category
  const product = await prisma.$queryRaw<any[]>`
    SELECT 
      p.*,
      c.id as "categoryId",
      c.name as "categoryName",
      c.description as "categoryDescription",
      c.image as "categoryImage",
      c."createdAt" as "categoryCreatedAt",
      c."updatedAt" as "categoryUpdatedAt"
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE p.id = ${id}
  `;
  
  if (product.length === 0) {
    return null;
  }

  // Get reviews separately
  const reviews = await prisma.$queryRaw<Review[]>`
    SELECT * FROM "Review"
    WHERE "productId" = ${id}
  `;

  // Format into the expected structure
  const formattedProduct = {
    ...product[0],
    category: {
      id: product[0].categoryId,
      name: product[0].categoryName,
      description: product[0].categoryDescription,
      image: product[0].categoryImage,
      createdAt: product[0].categoryCreatedAt,
      updatedAt: product[0].categoryUpdatedAt
    },
    reviews: reviews
  };

  return formattedProduct;
};

export const getAllProducts = async (options?: {
  skip?: number;
  take?: number;
  where?: Prisma.ProductWhereInput;
  orderBy?: Prisma.ProductOrderByWithRelationInput;
}): Promise<Product[]> => {
  // Building a dynamic SQL query based on options
  let whereClause = '';
  const skip = options?.skip || 0;
  const take = options?.take || 100; // Default limit
  
  // Building a basic query
  const products = await prisma.$queryRaw<any[]>`
    SELECT 
      p.*,
      c.id as "categoryId",
      c.name as "categoryName",
      c.description as "categoryDescription",
      c.image as "categoryImage",
      c."createdAt" as "categoryCreatedAt",
      c."updatedAt" as "categoryUpdatedAt"
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    ORDER BY p."updatedAt" DESC
    LIMIT ${take} OFFSET ${skip}
  `;

  // Format results to include the nested category object
  return products.map(product => ({
    ...product,
    category: {
      id: product.categoryId,
      name: product.categoryName,
      description: product.categoryDescription,
      image: product.categoryImage,
      createdAt: product.categoryCreatedAt,
      updatedAt: product.categoryUpdatedAt
    }
  }));
};

export const getFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  const featuredProducts = await prisma.$queryRaw<any[]>`
    SELECT 
      p.*,
      c.id as "categoryId",
      c.name as "categoryName",
      c.description as "categoryDescription",
      c.image as "categoryImage",
      c."createdAt" as "categoryCreatedAt",
      c."updatedAt" as "categoryUpdatedAt"
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE p.featured = true
    ORDER BY p."updatedAt" DESC
    LIMIT ${limit}
  `;

  // Format results to include the nested category object
  return featuredProducts.map(product => ({
    ...product,
    category: {
      id: product.categoryId,
      name: product.categoryName,
      description: product.categoryDescription,
      image: product.categoryImage,
      createdAt: product.categoryCreatedAt,
      updatedAt: product.categoryUpdatedAt
    }
  }));
};

export const updateProduct = async (id: string, data: Prisma.ProductUpdateInput): Promise<Product> => {
  // Building SET parts of the query dynamically based on the data object
  // In a real implementation, you'd need to build these SET clauses more carefully
  // This is a simplified example
  await prisma.$executeRaw`
    UPDATE "Product"
    SET
      "name" = COALESCE(${data.name}, "name"),
      "description" = COALESCE(${data.description}, "description"),
      "price" = COALESCE(${data.price}, "price"),
      "stock" = COALESCE(${data.stock}, "stock"),
      "featured" = COALESCE(${data.featured}, "featured"),
      "discount" = COALESCE(${data.discount}, "discount"),
      "updatedAt" = NOW()
    WHERE id = ${id}
  `;
  
  // Fetch the updated record
  const updatedProduct = await prisma.$queryRaw<Product[]>`
    SELECT * FROM "Product" WHERE id = ${id}
  `;
  
  return updatedProduct[0];
};

export const deleteProduct = async (id: string): Promise<Product> => {
  // First, get the product we're about to delete
  const product = await prisma.$queryRaw<Product[]>`
    SELECT * FROM "Product" WHERE id = ${id}
  `;
  
  if (product.length === 0) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  // Then delete it
  await prisma.$executeRaw`
    DELETE FROM "Product" WHERE id = ${id}
  `;
  
  return product[0];
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const searchQuery = `%${query}%`; // Add wildcards for LIKE query
  
  const searchResults = await prisma.$queryRaw<any[]>`
    SELECT 
      p.*,
      c.id as "categoryId",
      c.name as "categoryName",
      c.description as "categoryDescription",
      c.image as "categoryImage",
      c."createdAt" as "categoryCreatedAt",
      c."updatedAt" as "categoryUpdatedAt"
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE 
      p.name ILIKE ${searchQuery} OR
      p.description ILIKE ${searchQuery} OR
      c.name ILIKE ${searchQuery}
    ORDER BY p."updatedAt" DESC
  `;
  
  // Format results
  return searchResults.map(product => ({
    ...product,
    category: {
      id: product.categoryId,
      name: product.categoryName,
      description: product.categoryDescription,
      image: product.categoryImage,
      createdAt: product.categoryCreatedAt,
      updatedAt: product.categoryUpdatedAt
    }
  }));
};

// Function to get only products categorized as 'Medicine'
export const getMedicines = async (): Promise<(Product & { category: Category })[]> => {
  const medicines = await prisma.$queryRaw<any[]>`
    SELECT 
      p.*,
      c.id as "categoryId",
      c.name as "categoryName",
      c.description as "categoryDescription",
      c.image as "categoryImage",
      c."createdAt" as "categoryCreatedAt",
      c."updatedAt" as "categoryUpdatedAt"
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE c.name = 'Medicine'
    ORDER BY p."updatedAt" DESC
  `;
  
  // Format results
  return medicines.map(product => ({
    ...product,
    category: {
      id: product.categoryId,
      name: product.categoryName,
      description: product.categoryDescription,
      image: product.categoryImage,
      createdAt: product.categoryCreatedAt,
      updatedAt: product.categoryUpdatedAt
    }
  }));
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const categoryProducts = await prisma.$queryRaw<any[]>`
    SELECT 
      p.*,
      c.id as "categoryId",
      c.name as "categoryName",
      c.description as "categoryDescription",
      c.image as "categoryImage",
      c."createdAt" as "categoryCreatedAt",
      c."updatedAt" as "categoryUpdatedAt"
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE p."categoryId" = ${categoryId}
    ORDER BY p."updatedAt" DESC
  `;
  
  // Format results
  return categoryProducts.map(product => ({
    ...product,
    category: {
      id: product.categoryId,
      name: product.categoryName,
      description: product.categoryDescription,
      image: product.categoryImage,
      createdAt: product.categoryCreatedAt,
      updatedAt: product.categoryUpdatedAt
    }
  }));
}; 