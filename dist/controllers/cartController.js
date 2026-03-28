"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../configs/db");
const schema_1 = require("../models/schema");
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        let userCart = await db_1.db.select().from(schema_1.carts).where((0, drizzle_orm_1.eq)(schema_1.carts.userId, userId));
        if (userCart.length === 0) {
            userCart = await db_1.db.insert(schema_1.carts).values({ userId }).returning();
        }
        const cartId = userCart[0].id;
        const existingItem = await db_1.db.select()
            .from(schema_1.cartItems)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.cartItems.cartId, cartId), (0, drizzle_orm_1.eq)(schema_1.cartItems.productId, productId)));
        if (existingItem.length > 0) {
            const updatedItem = await db_1.db.update(schema_1.cartItems)
                .set({ quantity: existingItem[0].quantity + (quantity || 1) })
                .where((0, drizzle_orm_1.eq)(schema_1.cartItems.id, existingItem[0].id))
                .returning();
            res.status(200).json(updatedItem[0]);
            return;
        }
        const newItem = await db_1.db.insert(schema_1.cartItems).values({
            cartId,
            productId: productId,
            quantity: quantity || 1,
        }).returning();
        res.status(201).json(newItem[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userCart = await db_1.db.query.carts.findFirst({
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
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
};
exports.getCart = getCart;
const removeFromCart = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        await db_1.db.delete(schema_1.cartItems).where((0, drizzle_orm_1.eq)(schema_1.cartItems.id, itemId));
        res.status(200).json({ message: 'Item removed from cart' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.removeFromCart = removeFromCart;
//# sourceMappingURL=cartController.js.map