import { db } from '../../configs/db';
import { users } from '../../db/schema';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await db.insert(users).values({
    email: 'admin@emaracoffee.com',
    password: hashedPassword,
    role: 'ADMIN',
    status: 'ACTIVE',
    metadata: {
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+254 712 345 678',
      mobileNumber: '0712345678'
    },
    settings: {
      isTwoFactorEnabled: false
    }
  });
};