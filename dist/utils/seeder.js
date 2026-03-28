"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../configs/db");
const schema_1 = require("../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const coffeeNames = [
    'Nyeri Hill Estate SL28', 'Kirinyaga Peaberry Special', 'Kiambu Plateau SL34',
    'Ethiopian Yirgacheffe', 'Colombian Supremo', 'Sumatra Mandheling',
    'Costa Rica Tarrazu', 'Guatemala Antigua', 'Brazil Santos',
    'Jamaica Blue Mountain', 'Hawaii Kona', 'Rwanda Bourbon',
    'Panama Geisha', 'Kenya AA Top', 'Burundi Ngozi',
    'Tanzania Peaberry', 'El Salvador Pacamara', 'Honduras Marcala',
    'Nicaragua Matagalpa', 'Yemen Mocha Mattari'
];
const categories = ['Light Roast', 'Medium Roast', 'Dark Roast', 'Special Reserve'];
const seedDatabase = async () => {
    try {
        const existingAdmin = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, 'admin@emara.com'));
        if (existingAdmin.length > 0) {
            console.log('Database already seeded. Skipping...');
            return;
        }
        console.log('🌱 Seeding database...');
        const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
        const userPassword = await bcryptjs_1.default.hash('user123', 10);
        await db_1.db.insert(schema_1.users).values({
            firstName: 'Master',
            lastName: 'Admin',
            email: 'admin@emara.com',
            password: adminPassword,
            role: 'admin',
        });
        for (let i = 1; i <= 3; i++) {
            await db_1.db.insert(schema_1.users).values({
                firstName: `Test`,
                lastName: `User${i}`,
                email: `user${i}@emara.com`,
                password: userPassword,
                role: 'user',
            });
        }
        console.log('✅ Users seeded');
        const productsToInsert = coffeeNames.map((name, index) => {
            const category = categories[index % categories.length];
            const basePrice = category === 'Special Reserve' ? 45.00 : 18.00;
            const price = (basePrice + (index * 1.5)).toFixed(2);
            return {
                name,
                description: `Experience the unique flavor profile of our ${name}. Carefully sourced and expertly roasted to bring out the best in every cup. Perfect for your morning ritual.`,
                category,
                price,
                stock: Math.floor(Math.random() * 50) + 10,
                images: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop'],
            };
        });
        await db_1.db.insert(schema_1.products).values(productsToInsert);
        console.log('✅ 20 Products seeded');
        console.log('🌱 Seeding complete!');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
    }
};
exports.seedDatabase = seedDatabase;
//# sourceMappingURL=seeder.js.map