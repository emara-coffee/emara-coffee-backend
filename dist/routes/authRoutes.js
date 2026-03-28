"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const authValidators_1 = require("../validators/authValidators");
const router = (0, express_1.Router)();
router.post('/request-otp', (0, validateMiddleware_1.validate)(authValidators_1.requestOtpSchema), authController_1.requestOtp);
router.post('/signup', (0, validateMiddleware_1.validate)(authValidators_1.signupSchema), authController_1.signup);
router.post('/login', (0, validateMiddleware_1.validate)(authValidators_1.loginSchema), authController_1.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map