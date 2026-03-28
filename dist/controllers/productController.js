"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../configs/db");
const schema_1 = require("../models/schema");
const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock, images } = req.body;
        const newProduct = await db_1.db.insert(schema_1.products).values({
            name,
            description,
            category,
            price: price.toString(),
            stock,
            images,
        }).returning();
        res.status(201).json(newProduct[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const { page = '1', limit = '10', search, category, minPrice, maxPrice } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const conditions = [];
        if (search)
            conditions.push((0, drizzle_orm_1.ilike)(schema_1.products.name, `%${search}%`));
        if (category)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.products.category, category));
        if (minPrice)
            conditions.push((0, drizzle_orm_1.gte)(schema_1.products.price, minPrice));
        if (maxPrice)
            conditions.push((0, drizzle_orm_1.lte)(schema_1.products.price, maxPrice));
        const queryConditions = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const data = await db_1.db.select()
            .from(schema_1.products)
            .where(queryConditions)
            .limit(parseInt(limit))
            .offset(offset);
        const totalResult = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.products)
            .where(queryConditions);
        res.status(200).json({
            data,
            total: Number(totalResult[0].count),
            page: parseInt(page),
            limit: parseInt(limit),
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await db_1.db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id));
        if (product.length === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(product[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, category, price, stock, images } = req.body;
        const updatedProduct = await db_1.db.update(schema_1.products)
            .set({ name, description, category, price: price?.toString(), stock, images, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.products.id, id))
            .returning();
        if (updatedProduct.length === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(updatedProduct[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.updateProduct = updateProduct;
//# sourceMappingURL=productController.js.map