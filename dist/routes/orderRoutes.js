"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticate, orderController_1.placeOrder);
router.get('/my-orders', authMiddleware_1.authenticate, orderController_1.getUserOrders);
router.put('/:id/cancel', authMiddleware_1.authenticate, orderController_1.cancelOrder);
router.get('/admin', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, orderController_1.getAllOrders);
router.put('/admin/:id/status', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, orderController_1.updateOrderStatus);
router.put('/admin/:id/refund', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, orderController_1.updateRefundStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map