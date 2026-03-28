"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = require("../controllers/addressController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticate, addressController_1.addAddress);
router.get('/', authMiddleware_1.authenticate, addressController_1.getUserAddresses);
exports.default = router;
//# sourceMappingURL=addressRoutes.js.map