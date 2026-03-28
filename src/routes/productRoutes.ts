import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProduct } from '../controllers/productController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);

export default router;