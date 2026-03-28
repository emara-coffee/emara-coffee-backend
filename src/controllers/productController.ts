import { Request, Response } from 'express';
import { eq, and, ilike, gte, lte, sql } from 'drizzle-orm';
import { db } from '../configs/db';
import { products } from '../models/schema';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, price, stock, images } = req.body;
    
    const newProduct = await db.insert(products).values({
      name,
      description,
      category,
      price: price.toString(),
      stock,
      images,
    }).returning();

    res.status(201).json(newProduct[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search, category, minPrice, maxPrice } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const conditions = [];
    if (search) conditions.push(ilike(products.name, `%${search}%`));
    if (category) conditions.push(eq(products.category, category as string));
    if (minPrice) conditions.push(gte(products.price, minPrice as string));
    if (maxPrice) conditions.push(lte(products.price, maxPrice as string));

    const queryConditions = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.select()
      .from(products)
      .where(queryConditions)
      .limit(parseInt(limit as string))
      .offset(offset);

    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(queryConditions);

    res.status(200).json({
      data,
      total: Number(totalResult[0].count),
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await db.select().from(products).where(eq(products.id, id));
    
    if (product.length === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    res.status(200).json(product[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, category, price, stock, images } = req.body;
    
    const updatedProduct = await db.update(products)
      .set({ name, description, category, price: price?.toString(), stock, images, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (updatedProduct.length === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(updatedProduct[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};