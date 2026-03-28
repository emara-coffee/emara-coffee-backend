import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../configs/db';
import { orders, orderItems, carts, cartItems, products } from '../models/schema';
import { AuthRequest } from '../middlewares/authMiddleware';

export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { addressId } = req.body;
    const userId = req.user!.userId;

    const userCart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!userCart || userCart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    let totalAmount = 0;
    for (const item of userCart.items) {
      totalAmount += parseFloat(item.product.price as string) * item.quantity;
    }

    await db.transaction(async (tx) => {
      const newOrder = await tx.insert(orders).values({
        userId,
        addressId: addressId as string,
        totalAmount: totalAmount.toString(),
        status: 'placed',
      }).returning();

      const orderId = newOrder[0].id;

      for (const item of userCart.items) {
        await tx.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: item.product.price as string,
        });

        await tx.update(products)
          .set({ stock: item.product.stock - item.quantity })
          .where(eq(products.id, item.productId));
      }

      await tx.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
      await tx.delete(carts).where(eq(carts.id, userCart.id));

      res.status(201).json(newOrder[0]);
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const allOrders = await db.query.orders.findMany({
      with: {
        user: {
          columns: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const updatedOrder = await db.update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    res.status(200).json(updatedOrder[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const order = await db.select().from(orders).where(eq(orders.id, id));

    if (order.length === 0 || order[0].userId !== userId) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order[0].status === 'delivered' || order[0].status === 'cancelled') {
      res.status(400).json({ message: 'Order cannot be cancelled' });
      return;
    }

    const total = parseFloat(order[0].totalAmount as string);
    const penaltyAmount = total * 0.20;

    const updatedOrder = await db.update(orders)
      .set({
        status: 'cancelled',
        refundStatus: 'pending',
        penaltyAmount: penaltyAmount.toString(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    res.status(200).json(updatedOrder[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateRefundStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { refundStatus } = req.body;

    const updatedOrder = await db.update(orders)
      .set({ refundStatus, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    res.status(200).json(updatedOrder[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};