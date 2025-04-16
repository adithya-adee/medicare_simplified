import { prisma } from './db';
import { Prisma, Review, User, Product } from '@prisma/client';

// Create a new review
export const createReview = async (data: Prisma.ReviewCreateInput): Promise<Review> => {
  // Add validation: check if user has purchased the product before reviewing?
  return prisma.review.create({ data });
};

// Get reviews for a specific product
export const getProductReviews = async (productId: string): Promise<(Review & { user: User })[]> => {
  return prisma.review.findMany({
    where: { productId },
    include: {
      user: true, // Include user info (name, image)
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Get reviews written by a specific user
export const getUserReviews = async (userId: string): Promise<(Review & { product: Product })[]> => {
  return prisma.review.findMany({
    where: { userId },
    include: {
      product: true, // Include product info
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Update a review
export const updateReview = async (id: string, userId: string, data: Prisma.ReviewUpdateInput): Promise<Review> => {
  // Ensure the user owns the review before updating
  return prisma.review.update({
    where: { id, userId }, // Check ownership
    data,
  });
};

// Delete a review
export const deleteReview = async (id: string, userId: string): Promise<Review> => {
  // Ensure the user owns the review or is an admin
  return prisma.review.delete({
    where: { id, userId }, // Check ownership
  });
};

// Calculate average rating for a product
export const getProductAverageRating = async (productId: string): Promise<number | null> => {
  const result = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      productId,
    },
  });
  return result._avg.rating;
}; 