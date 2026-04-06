import { db } from '../../configs/db';
import { users, dealerProfiles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { logger } from '../logger';

const dealersData = [
  { businessName: 'Cascade Roasters', contactPerson: 'Sarah Jenkins', city: 'Seattle', state: 'Washington', country: 'USA', pincode: '98101', gstNumber: 'US123456789', status: 'APPROVED' },
  { businessName: 'Thames Coffee Trading', contactPerson: 'Arthur Pendelton', city: 'London', state: 'England', country: 'UK', pincode: 'EC1A 1BB', gstNumber: 'GB987654321', status: 'APPROVED' },
  { businessName: 'Melbourne Bean Co', contactPerson: 'Liam Hemsworth', city: 'Melbourne', state: 'Victoria', country: 'Australia', pincode: '3000', gstNumber: 'AU1122334455', status: 'APPROVED' },
  { businessName: 'Sakura Coffee Importers', contactPerson: 'Kenji Sato', city: 'Tokyo', state: 'Kanto', country: 'Japan', pincode: '100-0001', gstNumber: 'JP5566778899', status: 'APPROVED' },
  { businessName: 'Andean Harvest', contactPerson: 'Sofia Vergara', city: 'Bogota', state: 'Cundinamarca', country: 'Colombia', pincode: '110111', gstNumber: 'CO9988776655', status: 'PENDING' },
  { businessName: 'Berlin Brews', contactPerson: 'Lukas Muller', city: 'Berlin', state: 'Berlin', country: 'Germany', pincode: '10115', gstNumber: 'DE123123123', status: 'APPROVED' },
  { businessName: 'Espresso Roma', contactPerson: 'Giulia Rossi', city: 'Rome', state: 'Lazio', country: 'Italy', pincode: '00100', gstNumber: 'IT321321321', status: 'APPROVED' },
  { businessName: 'Maple Leaf Beans', contactPerson: 'David Chen', city: 'Toronto', state: 'Ontario', country: 'Canada', pincode: 'M5V 2A5', gstNumber: 'CA456456456', status: 'APPROVED' },
  { businessName: 'Seoul Roast Masters', contactPerson: 'Ji-Hoon Park', city: 'Seoul', state: 'Seoul', country: 'South Korea', pincode: '03000', gstNumber: 'KR789789789', status: 'APPROVED' },
  { businessName: 'Cape Horn Coffee', contactPerson: 'Nandi Ndlovu', city: 'Cape Town', state: 'Western Cape', country: 'South Africa', pincode: '8001', gstNumber: 'ZA147147147', status: 'SUSPENDED_PURCHASES' },
  { businessName: 'Parisian Pour', contactPerson: 'Camille Laurent', city: 'Paris', state: 'Île-de-France', country: 'France', pincode: '75001', gstNumber: 'FR258258258', status: 'APPROVED' },
  { businessName: 'Dutch Bean Exchange', contactPerson: 'Bram de Vries', city: 'Amsterdam', state: 'North Holland', country: 'Netherlands', pincode: '1012 AB', gstNumber: 'NL369369369', status: 'APPROVED' },
  { businessName: 'Amazonia Coffee', contactPerson: 'Mateus Silva', city: 'Sao Paulo', state: 'Sao Paulo', country: 'Brazil', pincode: '01000-000', gstNumber: 'BR951951951', status: 'PENDING' },
  { businessName: 'Highland Origins', contactPerson: 'Alemayehu Tadesse', city: 'Addis Ababa', state: 'Addis Ababa', country: 'Ethiopia', pincode: '1000', gstNumber: 'ET753753753', status: 'APPROVED' },
  { businessName: 'Rift Valley Traders', contactPerson: 'Faith Ochieng', city: 'Nairobi', state: 'Nairobi', country: 'Kenya', pincode: '00100', gstNumber: 'KE159159159', status: 'APPROVED' },
  { businessName: 'Nordic Roast Co', contactPerson: 'Elin Johansson', city: 'Stockholm', state: 'Stockholm', country: 'Sweden', pincode: '111 20', gstNumber: 'SE357357357', status: 'APPROVED' },
  { businessName: 'Kiwi Coffee Collective', contactPerson: 'Oliver Smith', city: 'Wellington', state: 'Wellington', country: 'New Zealand', pincode: '6011', gstNumber: 'NZ456123789', status: 'APPROVED' },
  { businessName: 'Bosphorus Beans', contactPerson: 'Emre Yilmaz', city: 'Istanbul', state: 'Istanbul', country: 'Turkey', pincode: '34000', gstNumber: 'TR987123654', status: 'PENDING' },
  { businessName: 'Catalan Coffee Works', contactPerson: 'Martina Garcia', city: 'Barcelona', state: 'Catalonia', country: 'Spain', pincode: '08001', gstNumber: 'ES654987321', status: 'APPROVED' },
  { businessName: 'Fjord Roasters', contactPerson: 'Henrik Larsen', city: 'Oslo', state: 'Oslo', country: 'Norway', pincode: '0150', gstNumber: 'NO321654987', status: 'SUSPENDED_FULL' }
];

export const seedDealers = async () => {
  try {
    await db.delete(dealerProfiles);
    await db.delete(users).where(eq(users.role, 'DEALER'));

    const hashedPassword = await bcrypt.hash('Dealer@123', 10);

    const usersToInsert = dealersData.map((dealer, index) => {
      const [firstName, ...lastNames] = dealer.contactPerson.split(' ');
      const phone = `+1555000${index.toString().padStart(4, '0')}`;

      return {
        email: `dealer${index + 1}@test.com`,
        password: hashedPassword,
        role: 'DEALER' as const,
        status: 'ACTIVE' as const,
        metadata: {
          firstName,
          lastName: lastNames.join(' '),
          businessName: dealer.businessName,
          phone,
          mobileNumber: phone
        },
        settings: {
          isTwoFactorEnabled: false
        }
      };
    });

    const insertedUsers = await db.insert(users).values(usersToInsert).returning({ id: users.id });

    const profilesToInsert = dealersData.map((dealer, index) => {
      const phone = `+1555000${index.toString().padStart(4, '0')}`;

      return {
        userId: insertedUsers[index].id,
        businessName: dealer.businessName,
        gstNumber: dealer.gstNumber,
        contactPerson: dealer.contactPerson,
        phone,
        street: `Warehouse ${index + 1}, Coffee Exchange District`,
        city: dealer.city,
        state: dealer.state,
        pincode: dealer.pincode,
        country: dealer.country,
        status: dealer.status as any,
        pricingTier: 'standard',
        averageRating: parseFloat((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 150) + 10,
      };
    });

    await db.insert(dealerProfiles).values(profilesToInsert);

    logger.info(`✅ Successfully seeded ${profilesToInsert.length} Dealers.`);
  } catch (error) {
    logger.error('❌ Error seeding dealers:', error);
  }
};