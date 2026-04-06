import { Router } from 'express';
import { checkoutCart, getMyOrders, capturePayPalPayment } from '../../controllers/shared/checkoutController';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();
router.use(protect);

router.post('/process', checkoutCart);
router.post('/capture', capturePayPalPayment);
router.get('/my-orders', getMyOrders);

export default router;