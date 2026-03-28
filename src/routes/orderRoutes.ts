import { Router } from 'express';
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder, updateRefundStatus } from '../controllers/orderController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, placeOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.put('/:id/cancel', authenticate, cancelOrder);

router.get('/admin', authenticate, authorizeAdmin, getAllOrders);
router.put('/admin/:id/status', authenticate, authorizeAdmin, updateOrderStatus);
router.put('/admin/:id/refund', authenticate, authorizeAdmin, updateRefundStatus);

export default router;