import { Router } from 'express';
import { addReview, getProductReviews, addReviewComment } from '../controllers/reviewController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authenticate, addReview);
router.post('/comment', authenticate, addReviewComment);

export default router;