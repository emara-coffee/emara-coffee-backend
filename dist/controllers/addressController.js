"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAddresses = exports.addAddress = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../configs/db");
const schema_1 = require("../models/schema");
const addAddress = async (req, res) => {
    try {
        const { street, city, state, zipCode, country, isDefault } = req.body;
        const userId = req.user.userId;
        if (isDefault) {
            await db_1.db.update(schema_1.addresses)
                .set({ isDefault: false })
                .where((0, drizzle_orm_1.eq)(schema_1.addresses.userId, userId));
        }
        const newAddress = await db_1.db.insert(schema_1.addresses).values({
            userId,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault: isDefault || false,
        }).returning();
        res.status(201).json(newAddress[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addAddress = addAddress;
const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userAddresses = await db_1.db.select().from(schema_1.addresses).where((0, drizzle_orm_1.eq)(schema_1.addresses.userId, userId));
        res.status(200).json(userAddresses);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getUserAddresses = getUserAddresses;
//# sourceMappingURL=addressController.js.map