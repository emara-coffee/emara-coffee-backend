"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./configs/env");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const redis_1 = require("./configs/redis");
const email_1 = __importDefault(require("./configs/email"));
const s3_1 = require("./configs/s3");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const loggerMiddleware_1 = require("./middlewares/loggerMiddleware");
const seeder_1 = require("./utils/seeder");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'https://thermostatic-winterweight-isabell.ngrok-free.dev'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(loggerMiddleware_1.requestLogger);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/addresses', addressRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await (0, redis_1.connectRedis)();
        await email_1.default.verifyConnection();
        (0, s3_1.getS3Client)();
        if (process.env.RUN_SEEDER === 'true') {
            await (0, seeder_1.seedDatabase)();
        }
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map