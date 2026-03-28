"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/product/:productId', reviewController_1.getProductReviews);
router.post('/', authMiddleware_1.authenticate, reviewController_1.addReview);
router.post('/comment', authMiddleware_1.authenticate, reviewController_1.addReviewComment);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map