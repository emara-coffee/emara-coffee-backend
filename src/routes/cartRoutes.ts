import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, addToCart);
router.get('/', authenticate, getCart);
router.delete('/:itemId', authenticate, removeFromCart);

export default router;