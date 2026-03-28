import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../configs/db';
import { carts, cartItems } from '../models/schema';
import { AuthRequest } from '../middlewares/authMiddleware';

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user!.userId;

    let userCart = await db.select().from(carts).where(eq(carts.userId, userId));

    if (userCart.length === 0) {
      userCart = await db.insert(carts).values({ userId }).returning();
    }

    const cartId = userCart[0].id;

    const existingItem = await db.select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId as string)));

    if (existingItem.length > 0) {
      const updatedItem = await db.update(cartItems)
        .set({ quantity: existingItem[0].quantity + (quantity || 1) })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      res.status(200).json(updatedItem[0]);
      return;
    }

    const newItem = await db.insert(cartItems).values({
      cartId,
      productId: productId as string,
      quantity: quantity || 1,
    }).returning();

    res.status(201).json(newItem[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const userCart = await db.query.carts.findFirst({
      where: (carts, { eq }) => eq(carts.userId, userId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!userCart) {
      res.status(200).json({ items: [] });
      return;
    }

    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const itemId = req.params.itemId as string;
    
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error });
  }
};