"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticate, cartController_1.addToCart);
router.get('/', authMiddleware_1.authenticate, cartController_1.getCart);
router.delete('/:itemId', authMiddleware_1.authenticate, cartController_1.removeFromCart);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map