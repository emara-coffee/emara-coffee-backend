"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReviewComment = exports.getProductReviews = exports.addReview = void 0;
const db_1 = require("../configs/db");
const schema_1 = require("../models/schema");
const addReview = async (req, res) => {
    try {
        const { productId, rating, text, media } = req.body;
        const userId = req.user.userId;
        const newReview = await db_1.db.insert(schema_1.reviews).values({
            productId: productId,
            userId,
            rating,
            text,
            media: media || [],
        }).returning();
        res.status(201).json(newReview[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addReview = addReview;
const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;
        const productReviews = await db_1.db.query.reviews.findMany({
            where: (reviews, { eq }) => eq(reviews.productId, productId),
            with: {
                user: {
                    columns: { firstName: true, lastName: true },
                },
                comments: true,
            },
            orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
        });
        res.status(200).json(productReviews);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};
exports.getProductReviews = getProductReviews;
const addReviewComment = async (req, res) => {
    try {
        const { reviewId, text } = req.body;
        const userId = req.user.userId;
        const newComment = await db_1.db.insert(schema_1.reviewComments).values({
            reviewId: reviewId,
            userId,
            text,
        }).returning();
        res.status(201).json(newComment[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addReviewComment = addReviewComment;
//# sourceMappingURL=reviewController.js.map