import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../configs/db';
import { addresses } from '../models/schema';
import { AuthRequest } from '../middlewares/authMiddleware';

export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    const userId = req.user!.userId;

    if (isDefault) {
      await db.update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId));
    }

    const newAddress = await db.insert(addresses).values({
      userId,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
    }).returning();

    res.status(201).json(newAddress[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUserAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, userId));
    res.status(200).json(userAddresses);
  } catch (error) {
    res.status(500).json({ error });
  }
};