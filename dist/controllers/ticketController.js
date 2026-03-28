"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketStatus = exports.addTicketMessage = exports.getTicketMessages = exports.getAllTickets = exports.getUserTickets = exports.createTicket = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../configs/db");
const schema_1 = require("../models/schema");
const createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const userId = req.user.userId;
        await db_1.db.transaction(async (tx) => {
            const newTicket = await tx.insert(schema_1.tickets).values({
                userId,
                subject,
            }).returning();
            await tx.insert(schema_1.ticketMessages).values({
                ticketId: newTicket[0].id,
                senderId: userId,
                message,
            });
            res.status(201).json(newTicket[0]);
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.createTicket = createTicket;
const getUserTickets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userTickets = await db_1.db.select().from(schema_1.tickets).where((0, drizzle_orm_1.eq)(schema_1.tickets.userId, userId));
        res.status(200).json(userTickets);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getUserTickets = getUserTickets;
const getAllTickets = async (req, res) => {
    try {
        const allTickets = await db_1.db.query.tickets.findMany({
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
    }
    catch (error) {
        console.error("Admin Ticket Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch all tickets" });
    }
};
exports.getAllTickets = getAllTickets;
const getTicketMessages = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const messages = await db_1.db.query.ticketMessages.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.ticketMessages.ticketId, ticketId),
            with: {
                sender: {
                    columns: { id: true, firstName: true, lastName: true, role: true },
                },
            },
            orderBy: (ticketMessages, { asc }) => [asc(ticketMessages.createdAt)],
        });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getTicketMessages = getTicketMessages;
const addTicketMessage = async (req, res) => {
    try {
        const { ticketId, message } = req.body;
        const senderId = req.user.userId;
        const newMessage = await db_1.db.insert(schema_1.ticketMessages).values({
            ticketId: ticketId,
            senderId,
            message,
        }).returning();
        await db_1.db.update(schema_1.tickets)
            .set({ updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.tickets.id, ticketId));
        res.status(201).json(newMessage[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addTicketMessage = addTicketMessage;
const updateTicketStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const updatedTicket = await db_1.db.update(schema_1.tickets)
            .set({ status, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.tickets.id, id))
            .returning();
        res.status(200).json(updatedTicket[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.updateTicketStatus = updateTicketStatus;
//# sourceMappingURL=ticketController.js.map