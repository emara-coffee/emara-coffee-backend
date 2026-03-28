"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRefundStatus = exports.cancelOrder = exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrders = exports.placeOrder = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../configs/db");
const schema_1 = require("../models/schema");
const placeOrder = async (req, res) => {
    try {
        const { addressId } = req.body;
        const userId = req.user.userId;
        const userCart = await db_1.db.query.carts.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.carts.userId, userId),
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
            totalAmount += parseFloat(item.product.price) * item.quantity;
        }
        await db_1.db.transaction(async (tx) => {
            const newOrder = await tx.insert(schema_1.orders).values({
                userId,
                addressId: addressId,
                totalAmount: totalAmount.toString(),
                status: 'placed',
            }).returning();
            const orderId = newOrder[0].id;
            for (const item of userCart.items) {
                await tx.insert(schema_1.orderItems).values({
                    orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtTime: item.product.price,
                });
                await tx.update(schema_1.products)
                    .set({ stock: item.product.stock - item.quantity })
                    .where((0, drizzle_orm_1.eq)(schema_1.products.id, item.productId));
            }
            await tx.delete(schema_1.cartItems).where((0, drizzle_orm_1.eq)(schema_1.cartItems.cartId, userCart.id));
            await tx.delete(schema_1.carts).where((0, drizzle_orm_1.eq)(schema_1.carts.id, userCart.id));
            res.status(201).json(newOrder[0]);
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.placeOrder = placeOrder;
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userOrders = await db_1.db.query.orders.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.orders.userId, userId),
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
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getUserOrders = getUserOrders;
const getAllOrders = async (req, res) => {
    try {
        const allOrders = await db_1.db.query.orders.findMany({
            with: {
                user: {
                    columns: { id: true, firstName: true, lastName: true, email: true },
                },
            },
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        });
        res.status(200).json(allOrders);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const updatedOrder = await db_1.db.update(schema_1.orders)
            .set({ status, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, id))
            .returning();
        res.status(200).json(updatedOrder[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const cancelOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const order = await db_1.db.select().from(schema_1.orders).where((0, drizzle_orm_1.eq)(schema_1.orders.id, id));
        if (order.length === 0 || order[0].userId !== userId) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (order[0].status === 'delivered' || order[0].status === 'cancelled') {
            res.status(400).json({ message: 'Order cannot be cancelled' });
            return;
        }
        const total = parseFloat(order[0].totalAmount);
        const penaltyAmount = total * 0.20;
        const updatedOrder = await db_1.db.update(schema_1.orders)
            .set({
            status: 'cancelled',
            refundStatus: 'pending',
            penaltyAmount: penaltyAmount.toString(),
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, id))
            .returning();
        res.status(200).json(updatedOrder[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.cancelOrder = cancelOrder;
const updateRefundStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { refundStatus } = req.body;
        const updatedOrder = await db_1.db.update(schema_1.orders)
            .set({ refundStatus, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, id))
            .returning();
        res.status(200).json(updatedOrder[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.updateRefundStatus = updateRefundStatus;
//# sourceMappingURL=orderController.js.map