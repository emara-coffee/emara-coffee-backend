import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../configs/db';
import { reviews, reviewComments } from '../models/schema';
import { AuthRequest } from '../middlewares/authMiddleware';

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, text, media } = req.body;
    const userId = req.user!.userId;

    const newReview = await db.insert(reviews).values({
      productId,
      userId,
      rating,
      text,
      media: media || [],
    }).returning();

    res.status(201).json(newReview[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const productReviews = await db.query.reviews.findMany({
      where: (reviews, { eq }) => eq(reviews.productId, productId),
      with: {
        user: {
          columns: { firstName: true, lastName: true },
        },
        comments: true, // Matches 'comments: many(reviewComments)' in schema
      },
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
    });

    res.status(200).json(productReviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const addReviewComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId, text } = req.body;
    const userId = req.user!.userId;

    const newComment = await db.insert(reviewComments).values({
      reviewId,
      userId,
      text,
    }).returning();

    res.status(201).json(newComment[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};