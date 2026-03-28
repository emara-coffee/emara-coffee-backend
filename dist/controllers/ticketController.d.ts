import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
export declare const createTicket: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserTickets: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllTickets: (req: Request, res: Response) => Promise<void>;
export declare const getTicketMessages: (req: Request, res: Response) => Promise<void>;
export declare const addTicketMessage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTicketStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=ticketController.d.ts.map