import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../configs/db';
import { tickets, ticketMessages } from '../models/schema';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subject, message } = req.body;
    const userId = req.user!.userId;

    await db.transaction(async (tx) => {
      const newTicket = await tx.insert(tickets).values({
        userId,
        subject,
      }).returning();

      await tx.insert(ticketMessages).values({
        ticketId: newTicket[0].id,
        senderId: userId,
        message,
      });

      res.status(201).json(newTicket[0]);
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUserTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const userTickets = await db.select().from(tickets).where(eq(tickets.userId, userId));
    res.status(200).json(userTickets);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getAllTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const allTickets = await db.query.tickets.findMany({
      with: {
        user: {
          columns: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            email: true 
          },
        },
      },
      orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
    });
    
    res.status(200).json(allTickets);
  } catch (error) {
    console.error("Admin Ticket Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch all tickets" });
  }
};

export const getTicketMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketId = req.params.ticketId as string;
    const messages = await db.query.ticketMessages.findMany({
      where: eq(ticketMessages.ticketId, ticketId),
      with: {
        sender: {
          columns: { id: true, firstName: true, lastName: true, role: true },
        },
      },
      orderBy: (ticketMessages, { asc }) => [asc(ticketMessages.createdAt)],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const addTicketMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ticketId, message } = req.body;
    const senderId = req.user!.userId;

    const newMessage = await db.insert(ticketMessages).values({
      ticketId: ticketId as string,
      senderId,
      message,
    }).returning();

    await db.update(tickets)
      .set({ updatedAt: new Date() })
      .where(eq(tickets.id, ticketId as string));

    res.status(201).json(newMessage[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const updatedTicket = await db.update(tickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();

    res.status(200).json(updatedTicket[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};