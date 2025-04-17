import { prisma } from './db';
import { Prisma, Review, User, Product } from '@prisma/client';

// Create a new review
export const createReview = async (data: Prisma.ReviewCreateInput): Promise<Review> => {
  // Insert the review with raw SQL
  await prisma.$executeRaw`
    INSERT INTO "Review" (
      "rating", 
      "comment", 
      "userId", 
      "productId", 
      "createdAt", 
      "updatedAt"
    ) VALUES (
      ${data.rating},
      ${data.comment || null},
      ${data.user.connect?.id},
      ${data.product.connect?.id},
      NOW(),
      NOW()
    )
  `;
  
  // Fetch the created review
  const createdReview = await prisma.$queryRaw<Review[]>`
    SELECT * FROM "Review" 
    WHERE "userId" = ${data.user.connect?.id} 
    AND "productId" = ${data.product.connect?.id}
    ORDER BY "createdAt" DESC 
    LIMIT 1
  `;
  
  return createdReview[0];
};

// Get reviews for a specific product
export const getProductReviews = async (productId: string): Promise<(Review & { user: User })[]> => {
  // Get reviews with user data
  const reviews = await prisma.$queryRaw<any[]>`
    SELECT 
      r.*,
      u.id as "userId",
      u.name as "userName",
      u.email as "userEmail",
      u.image as "userImage",
      u.role as "userRole"
    FROM "Review" r
    LEFT JOIN "User" u ON r."userId" = u.id
    WHERE r."productId" = ${productId}
    ORDER BY r."createdAt" DESC
  `;
  
  // Format the results to include nested user object
  return reviews.map(review => ({
    ...review,
    user: {
      id: review.userId,
      name: review.userName,
      email: review.userEmail,
      image: review.userImage,
      role: review.userRole
    }
  }));
};

// Get reviews written by a specific user
export const getUserReviews = async (userId: string): Promise<(Review & { product: Product })[]> => {
  // Get reviews with product data
  const reviews = await prisma.$queryRaw<any[]>`
    SELECT 
      r.*,
      p.id as "productId",
      p.name as "productName",
      p.description as "productDescription",
      p.price as "productPrice",
      p.stock as "productStock",
      p.images as "productImages",
      p.featured as "productFeatured",
      p.discount as "productDiscount",
      p."categoryId" as "productCategoryId"
    FROM "Review" r
    LEFT JOIN "Product" p ON r."productId" = p.id
    WHERE r."userId" = ${userId}
    ORDER BY r."createdAt" DESC
  `;
  
  // Format the results to include nested product object
  return reviews.map(review => ({
    ...review,
    product: {
      id: review.productId,
      name: review.productName,
      description: review.productDescription,
      price: review.productPrice,
      stock: review.productStock,
      images: review.productImages,
      featured: review.productFeatured,
      discount: review.productDiscount,
      categoryId: review.productCategoryId
    }
  }));
};

// Update a review
export const updateReview = async (id: string, userId: string, data: Prisma.ReviewUpdateInput): Promise<Review> => {
  // Ensure the user owns the review before updating
  // Check if the review belongs to the user
  const existingReview = await prisma.$queryRaw<Review[]>`
    SELECT * FROM "Review" WHERE id = ${id} AND "userId" = ${userId}
  `;
  
  if (existingReview.length === 0) {
    throw new Error('Review not found or you do not have permission to update it');
  }
  
  // Update the review
  await prisma.$executeRaw`
    UPDATE "Review"
    SET
      "rating" = COALESCE(${data.rating}, "rating"),
      "comment" = COALESCE(${data.comment}, "comment"),
      "updatedAt" = NOW()
    WHERE id = ${id} AND "userId" = ${userId}
  `;
  
  // Get the updated review
  const updatedReview = await prisma.$queryRaw<Review[]>`
    SELECT * FROM "Review" WHERE id = ${id}
  `;
  
  return updatedReview[0];
};

// Delete a review
export const deleteReview = async (id: string, userId: string): Promise<Review> => {
  // Ensure the user owns the review before deleting
  const review = await prisma.$queryRaw<Review[]>`
    SELECT * FROM "Review" WHERE id = ${id} AND "userId" = ${userId}
  `;
  
  if (review.length === 0) {
    throw new Error('Review not found or you do not have permission to delete it');
  }
  
  // Delete the review
  await prisma.$executeRaw`
    DELETE FROM "Review" WHERE id = ${id} AND "userId" = ${userId}
  `;
  
  return review[0];
};

// Calculate average rating for a product
export const getProductAverageRating = async (productId: string): Promise<number | null> => {
  const result = await prisma.$queryRaw<{avg: number | null}[]>`
    SELECT AVG(rating) as avg
    FROM "Review"
    WHERE "productId" = ${productId}
  `;
  
  return result[0]?.avg || null;
}; 