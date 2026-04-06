"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Category_1 = __importDefault(require("../models/Category"));
const Product_1 = __importDefault(require("../models/Product"));
const DealerProfile_1 = __importDefault(require("../models/DealerProfile"));
const Order_1 = __importDefault(require("../models/Order"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const logger_1 = require("./logger");
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env.development') });
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        logger_1.logger.info('MongoDB Connected');
    }
    catch (err) {
        logger_1.logger.error(err);
        process.exit(1);
    }
};
const importData = async () => {
    try {
        await connectDB();
        await Promise.all([
            Order_1.default.deleteMany(),
            Product_1.default.deleteMany(),
            Category_1.default.deleteMany(),
            DealerProfile_1.default.deleteMany(),
            User_1.default.deleteMany(),
            Invoice_1.default.deleteMany(),
        ]);
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash('12345678', salt);
        await User_1.default.create({
            email: 'admin@bharatforge.com',
            role: 'admin',
            password: hashedPassword,
            isVerified: true,
        });
        const categories = await Category_1.default.insertMany([
            { name: 'Passenger Tyres', slug: 'passenger-tyres', description: 'Car tyres', imageUrl: 'https://images.unsplash.com/photo-1620064567006-25807ebc6319?auto=format&fit=crop&q=80&w=800', isActive: true },
            { name: 'Commercial Tyres', slug: 'commercial-tyres', description: 'Truck tyres', imageUrl: 'https://images.unsplash.com/photo-1586213797960-a548325db0fc?auto=format&fit=crop&q=80&w=800', isActive: true },
            { name: 'Automotive Batteries', slug: 'automotive-batteries', description: 'Car batteries', imageUrl: 'https://images.unsplash.com/photo-1622350711717-d2e8db50a0f8?auto=format&fit=crop&q=80&w=800', isActive: true },
            { name: 'Alloy Wheels', slug: 'alloy-wheels', description: 'Alloy wheels', imageUrl: 'https://images.unsplash.com/photo-1580274455171-bf1059f14bf2?auto=format&fit=crop&q=80&w=800', isActive: true }
        ]);
        const products = await Product_1.default.insertMany([
            {
                name: 'UltraGrip SUV',
                sku: 'TY-001',
                hsnCode: '40111010',
                category: categories[0]._id,
                description: 'Premium SUV tyre with enhanced wet grip technology.',
                specifications: { Size: '225/65 R17', LoadIndex: '102H' },
                images: ['https://images.unsplash.com/photo-1616788902258-138db56fe7e5?auto=format&fit=crop&q=80&w=800'],
                basePrice: 8500,
                bulkPricing: [{ minQuantity: 10, price: 8000 }],
                moq: 10,
                stock: 500,
                certifications: ['BIS', 'ISO'],
                warrantyInfo: '5 Years Manufacturer Warranty',
            },
            {
                name: 'TruckMax Pro',
                sku: 'TY-002',
                hsnCode: '40112010',
                category: categories[1]._id,
                description: 'Heavy duty commercial truck tyre for long haul operations.',
                specifications: { Size: '295/80 R22.5', PlyRating: '16PR' },
                images: ['https://images.unsplash.com/photo-1585824856765-0cab8940a879?auto=format&fit=crop&q=80&w=800'],
                basePrice: 18000,
                bulkPricing: [{ minQuantity: 10, price: 17000 }],
                moq: 10,
                stock: 300,
                certifications: ['BIS'],
                warrantyInfo: '3 Years Replacement Warranty',
            },
            {
                name: 'PowerMax Battery',
                sku: 'BT-001',
                hsnCode: '85072000',
                category: categories[2]._id,
                description: 'Maintenance-free 12V Automotive battery.',
                specifications: { Voltage: '12V', Capacity: '150Ah' },
                images: ['https://images.unsplash.com/photo-1676337167752-2062c6ca7366?auto=format&fit=crop&q=80&w=800'],
                basePrice: 12000,
                bulkPricing: [{ minQuantity: 5, price: 11500 }],
                moq: 5,
                stock: 150,
                certifications: ['ISO', 'CE'],
                warrantyInfo: '36 Months Guarantee',
            },
            {
                name: 'Sport Alloy Wheel',
                sku: 'WH-001',
                hsnCode: '87087000',
                category: categories[3]._id,
                description: 'Premium 17 inch sport alloy wheel set.',
                specifications: { Size: '17 inch', Material: 'Aluminum Alloy' },
                images: ['https://plus.unsplash.com/premium_photo-1694670121843-79b433c4ed59?auto=format&fit=crop&q=80&w=800'],
                basePrice: 15000,
                bulkPricing: [{ minQuantity: 4, price: 14000 }],
                moq: 4,
                stock: 200,
                certifications: ['ISO', 'ARAI'],
                warrantyInfo: '2 Years Finish Warranty',
            }
        ]);
        const dealer1 = await User_1.default.create({ email: 'contact@stellarauto.com', role: 'dealer', password: hashedPassword, isVerified: true });
        const dealer2 = await User_1.default.create({ email: 'kolkata@tyrehub.com', role: 'dealer', password: hashedPassword, isVerified: true });
        const dealers = await DealerProfile_1.default.insertMany([
            {
                user: dealer1._id,
                businessName: 'Stellar Auto Spares',
                gstNumber: '27AAAAA0000A1Z5',
                contactPerson: 'Vikram Singh',
                phone: '+919876543210',
                address: { street: 'MIDC Industrial Area', city: 'Mumbai', state: 'MH', pincode: '400093', country: 'India' },
                productCategories: [categories[0]._id, categories[2]._id],
                status: 'approved',
                pricingTier: 'gold',
            },
            {
                user: dealer2._id,
                businessName: 'Kolkata Tyre Hub',
                gstNumber: '22BBBBB1111B2Z6',
                contactPerson: 'Amit Kumar',
                phone: '+919876543211',
                address: { street: 'AJC Bose Road', city: 'Kolkata', state: 'WB', pincode: '700020', country: 'India' },
                productCategories: [categories[1]._id],
                status: 'approved',
                pricingTier: 'standard',
            },
        ]);
        const orders = await Order_1.default.insertMany([
            {
                user: dealer1._id,
                dealerProfile: dealers[0]._id,
                items: [{ product: products[0]._id, quantity: 20, price: 8000 }],
                totalAmount: 160000,
                status: 'delivered',
                shippingAddress: dealers[0].address,
                paymentMethod: 'credit_term',
                paymentStatus: 'completed',
            },
            {
                user: dealer2._id,
                dealerProfile: dealers[1]._id,
                items: [{ product: products[2]._id, quantity: 10, price: 11500 }],
                totalAmount: 115000,
                status: 'processing',
                shippingAddress: dealers[1].address,
                paymentMethod: 'razorpay',
                paymentStatus: 'completed',
                razorpayOrderId: 'rzp_mock',
                razorpayPaymentId: 'pay_mock',
                razorpaySignature: 'sig_mock',
            },
        ]);
        await Invoice_1.default.insertMany([
            {
                order: orders[0]._id,
                invoiceNumber: 'INV-001',
                dealerProfile: dealers[0]._id,
                user: dealer1._id,
                fileUrl: 'https://example.com/invoice1.pdf',
                totalAmount: 160000,
            },
            {
                order: orders[1]._id,
                invoiceNumber: 'INV-002',
                dealerProfile: dealers[1]._id,
                user: dealer2._id,
                fileUrl: 'https://example.com/invoice2.pdf',
                totalAmount: 115000,
            },
        ]);
        logger_1.logger.info('Seeding complete');
        process.exit();
    }
    catch (err) {
        logger_1.logger.error(err);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        await connectDB();
        await Promise.all([
            Order_1.default.deleteMany(),
            Product_1.default.deleteMany(),
            Category_1.default.deleteMany(),
            DealerProfile_1.default.deleteMany(),
            User_1.default.deleteMany(),
            Invoice_1.default.deleteMany(),
        ]);
        logger_1.logger.info('Destroyed');
        process.exit();
    }
    catch (err) {
        logger_1.logger.error(err);
        process.exit(1);
    }
};
if (process.argv[2] === '-d') {
    destroyData();
}
else {
    importData();
}
//# sourceMappingURL=seeder.js.map