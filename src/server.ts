import './configs/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectRedis } from './configs/redis';
import EmailConfig from './configs/email';
import { getS3Client } from './configs/s3';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import reviewRoutes from './routes/reviewRoutes';
import addressRoutes from './routes/addressRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import ticketRoutes from './routes/ticketRoutes';
import uploadRoutes from './routes/uploadRoutes';

import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/loggerMiddleware';
import { seedDatabase } from './utils/seeder';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: [
        `${process.env.FRONTEND_URL}`
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectRedis();
        await EmailConfig.verifyConnection();
        getS3Client();

        // Check if the environment flag is set to run the seeder
        if (process.env.RUN_SEEDER === 'true') {
            await seedDatabase();
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();