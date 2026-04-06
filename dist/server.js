"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const redis_1 = require("./configs/redis");
const socket_1 = require("./configs/socket");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const logger_1 = require("./utils/logger");
const authRoutes_1 = __importDefault(require("./routes/auth/authRoutes"));
const articleCategoryRoutes_1 = __importDefault(require("./routes/admin/articleCategoryRoutes"));
const articleRoutes_1 = __importDefault(require("./routes/admin/articleRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/admin/categoryRoutes"));
const dealerManagementRoutes_1 = __importDefault(require("./routes/admin/dealerManagementRoutes"));
const dealershipApprovalRoutes_1 = __importDefault(require("./routes/admin/dealershipApprovalRoutes"));
const orderManagementRoutes_1 = __importDefault(require("./routes/admin/orderManagementRoutes"));
const productRoutes_1 = __importDefault(require("./routes/admin/productRoutes"));
const ticketManagementRoutes_1 = __importDefault(require("./routes/admin/ticketManagementRoutes"));
const userManagementRoutes_1 = __importDefault(require("./routes/admin/userManagementRoutes"));
const dealershipRequestRoutes_1 = __importDefault(require("./routes/dealer/dealershipRequestRoutes"));
const verificationRoutes_1 = __importDefault(require("./routes/dealer/verificationRoutes"));
const inventoryManagementRoutes_1 = __importDefault(require("./routes/dealer/inventoryManagementRoutes"));
const articleRoutes_2 = __importDefault(require("./routes/public/articleRoutes"));
const catalogRoutes_1 = __importDefault(require("./routes/public/catalogRoutes"));
const guidedSearchRoutes_1 = __importDefault(require("./routes/public/guidedSearchRoutes"));
const dealerRoutes_1 = __importDefault(require("./routes/public/dealerRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/shared/cartRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/shared/chatRoutes"));
const checkoutRoutes_1 = __importDefault(require("./routes/shared/checkoutRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/shared/notificationRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/shared/orderRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/shared/profileRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/shared/ticketRoutes"));
const articleInteractionRoutes_1 = __importDefault(require("./routes/user/articleInteractionRoutes"));
const dealerReviewRoutes_1 = __importDefault(require("./routes/user/dealerReviewRoutes"));
const productReviewRoutes_1 = __importDefault(require("./routes/user/productReviewRoutes"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
(0, socket_1.setupSocket)(httpServer);
app.use((0, morgan_1.default)('dev', {
    stream: {
        write: (message) => logger_1.logger.info(message.trim())
    }
}));
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'Origin', 'Accept']
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin/article-categories', articleCategoryRoutes_1.default);
app.use('/api/admin/articles', articleRoutes_1.default);
app.use('/api/admin/categories', categoryRoutes_1.default);
app.use('/api/admin/dealer-management', dealerManagementRoutes_1.default);
app.use('/api/admin/dealership-approvals', dealershipApprovalRoutes_1.default);
app.use('/api/admin/order-management', orderManagementRoutes_1.default);
app.use('/api/admin/products', productRoutes_1.default);
app.use('/api/admin/ticket-management', ticketManagementRoutes_1.default);
app.use('/api/admin/users', userManagementRoutes_1.default);
app.use('/api/dealer/requests', dealershipRequestRoutes_1.default);
app.use('/api/dealer/verification', verificationRoutes_1.default);
app.use('/api/dealer/inventory', inventoryManagementRoutes_1.default);
app.use('/api/public/articles', articleRoutes_2.default);
app.use('/api/public/catalog', catalogRoutes_1.default);
app.use('/api/public/guided-search', guidedSearchRoutes_1.default);
app.use('/api/public/dealers', dealerRoutes_1.default);
app.use('/api/shared/cart', cartRoutes_1.default);
app.use('/api/shared/chat', chatRoutes_1.default);
app.use('/api/shared/checkout', checkoutRoutes_1.default);
app.use('/api/shared/notifications', notificationRoutes_1.default);
app.use('/api/shared/orders', orderRoutes_1.default);
app.use('/api/shared/profile', profileRoutes_1.default);
app.use('/api/shared/tickets', ticketRoutes_1.default);
app.use('/api/user/article-interactions', articleInteractionRoutes_1.default);
app.use('/api/user/dealer-reviews', dealerReviewRoutes_1.default);
app.use('/api/user/product-reviews', productReviewRoutes_1.default);
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;
const startServer = async () => {
    try {
        await (0, redis_1.connectRedis)();
        httpServer.listen(PORT, '0.0.0.0', () => {
            logger_1.logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map