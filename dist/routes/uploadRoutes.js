"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticate, uploadMiddleware_1.upload.array('files', 5), uploadController_1.uploadFiles);
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map