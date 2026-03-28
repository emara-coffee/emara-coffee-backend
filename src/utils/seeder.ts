import bcrypt from 'bcryptjs';
import { db } from '../configs/db';
import { users, products } from '../models/schema';
import { eq } from 'drizzle-orm';

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

export const seedDatabase = async () => {
  try {
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@emara.com'));
    
    if (existingAdmin.length > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    console.log('🌱 Seeding database...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Seed 1 Admin
    await db.insert(users).values({
      firstName: 'Master',
      lastName: 'Admin',
      email: 'admin@emara.com',
      password: adminPassword,
      role: 'admin',
    });

    // Seed 3 Users
    for (let i = 1; i <= 3; i++) {
      await db.insert(users).values({
        firstName: `Test`,
        lastName: `User${i}`,
        email: `user${i}@emara.com`,
        password: userPassword,
        role: 'user',
      });
    }

    console.log('✅ Users seeded');

    // Seed 20 Products
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

    await db.insert(products).values(productsToInsert);
    
    console.log('✅ 20 Products seeded');
    console.log('🌱 Seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};