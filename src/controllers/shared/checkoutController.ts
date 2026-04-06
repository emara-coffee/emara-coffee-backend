import { Response } from 'express';
import { db } from '../../configs/db';
import { carts, cartItems, orders, orderItems, products, dealerProfiles } from '../../db/schema';
import { eq, and, desc, sql, ilike } from 'drizzle-orm';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { createPayPalOrder, verifyAndCapturePayPalOrder } from '../../services/paypalService';
import { logger } from '../../utils/logger';

export const checkoutCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    logger.info(`Starting checkout process for user: ${userId}`);

    const cart = await db.select().from(carts).where(eq(carts.userId, userId));
    if (cart.length === 0) {
      logger.warn(`Checkout failed: Cart is empty for user ${userId}`);
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cart[0].id));
    if (items.length === 0) {
      logger.warn(`Checkout failed: Cart items empty for cart ${cart[0].id}`);
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    let totalAmount = 0;
    for (const item of items) {
      const product = await db.select().from(products).where(eq(products.id, item.productId));
      if (product[0].stock < item.quantity) {
        logger.warn(`Checkout failed: Insufficient stock for product ${product[0].name}`);
        res.status(400).json({ message: `Insufficient stock for ${product[0].name}` });
        return;
      }
      totalAmount += item.price * item.quantity;
    }

    let dealerId = null;
    if (req.user.role === 'DEALER') {
      const dealer = await db.select().from(dealerProfiles).where(eq(dealerProfiles.userId, userId));
      if (dealer.length > 0) dealerId = dealer[0].id;
    }

    const result = await db.transaction(async (tx) => {
      const newOrder = await tx.insert(orders).values({
        userId,
        dealerProfileId: dealerId,
        totalAmount,
        paymentMethod: 'paypal', // Strictly PayPal
        shippingStreet: shippingAddress.street,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingPincode: shippingAddress.pincode,
        shippingCountry: shippingAddress.country || 'India',
      }).returning();

      for (const item of items) {
        await tx.insert(orderItems).values({
          orderId: newOrder[0].id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }

      logger.info(`Database order created: ${newOrder[0].id}. Initiating PayPal order creation.`);
      
      const paypalOrder = await createPayPalOrder(totalAmount, newOrder[0].id);
      const paypalOrderId = paypalOrder.id;
      
      await tx.update(orders).set({ paypalOrderId }).where(eq(orders.id, newOrder[0].id));

      logger.info(`PayPal order ${paypalOrderId} successfully attached to local order ${newOrder[0].id}`);

      return { order: newOrder[0], paypalOrderId };
    });

    res.status(201).json({ order: result.order, paypalOrderId: result.paypalOrderId });
  } catch (error) {
    logger.error(`Checkout Process Error: ${(error as Error).message}`, { error });
    res.status(500).json({ message: 'Server error during checkout' });
  }
};

export const capturePayPalPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;
    
    logger.info(`Attempting to capture PayPal payment for order: ${orderId}`);
    
    const isCaptured = await verifyAndCapturePayPalOrder(orderId);
    
    if (isCaptured) {
      logger.info(`PayPal capture successful for order: ${orderId}. Updating database.`);
      
      // CRITICAL: Check your enums.ts to ensure 'COMPLETED' is the exact string you used.
      await db.update(orders)
        .set({ paymentStatus: 'COMPLETED' }) 
        .where(eq(orders.paypalOrderId, orderId));
      
      const cart = await db.select().from(carts).where(eq(carts.userId, userId));
      if (cart.length > 0) {
        await db.delete(cartItems).where(eq(cartItems.cartId, cart[0].id));
        logger.info(`Cart cleared for user: ${userId}`);
      }

      res.status(200).json({ success: true, message: 'Payment captured successfully' });
    } else {
      logger.warn(`PayPal capture returned false for order: ${orderId}`);
      res.status(400).json({ success: false, message: 'Payment capture failed' });
    }
  } catch (error) {
    logger.error(`Payment Capture Exception: ${(error as Error).message}`, { error });
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const conditions = [eq(orders.userId, userId)];

    if (status) conditions.push(eq(orders.status, status as any));
    if (search) conditions.push(ilike(orders.id, `%${search}%`));

    const whereClause = and(...conditions);

    const results = await db.select()
      .from(orders)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(orders.createdAt));

    const totalCountQuery = await db.select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(whereClause);

    res.status(200).json({
      data: results,
      meta: {
        totalCount: totalCountQuery[0].count,
        totalPages: Math.ceil(totalCountQuery[0].count / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    logger.error(`Get My Orders Error: ${(error as Error).message}`, { error });
    res.status(500).json({ message: 'Server error' });
  }
};