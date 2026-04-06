import { Response } from 'express';
import { db } from '../../configs/db';
import { termsConditions } from '../../db/schema/terms/term.schema';
import { eq, desc, sql, ilike, or } from 'drizzle-orm';
import { AuthRequest } from '../../middlewares/authMiddleware';

export const createTerm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { version, title, content } = req.body;
    const newTerm = await db.insert(termsConditions).values({
      version,
      title,
      content,
      isActive: false
    }).returning();
    res.status(201).json(newTerm[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTerm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { version, title, content } = req.body;
    const updatedTerm = await db.update(termsConditions)
      .set({ version, title, content, updatedAt: new Date() })
      .where(eq(termsConditions.id as any, id as any))
      .returning();
    res.status(200).json(updatedTerm[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTermsList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (search) {
      whereClause = or(
        ilike(termsConditions.title, `%${search}%`),
        ilike(termsConditions.version, `%${search}%`)
      );
    }

    const results = await db.select()
      .from(termsConditions)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(termsConditions.createdAt));

    const countQuery = await db.select({ count: sql<number>`count(*)::int` })
      .from(termsConditions)
      .where(whereClause);

    res.status(200).json({
      data: results,
      meta: {
        totalCount: countQuery[0].count,
        totalPages: Math.ceil(countQuery[0].count / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const activateTerm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    await db.transaction(async (tx) => {
      await tx.update(termsConditions).set({ isActive: false });
      await tx.update(termsConditions).set({ isActive: true }).where(eq(termsConditions.id as any, id as any));
    });

    res.status(200).json({ success: true, message: 'Term activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTerm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await db.delete(termsConditions).where(eq(termsConditions.id as any, id as any));
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};