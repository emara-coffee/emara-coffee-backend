import { Router } from 'express';
import { createTicket, getUserTickets, getAllTickets, getTicketMessages, addTicketMessage, updateTicketStatus } from '../controllers/ticketController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, createTicket);
router.get('/my-tickets', authenticate, getUserTickets);
router.get('/:ticketId/messages', authenticate, getTicketMessages);
router.post('/messages', authenticate, addTicketMessage);

router.get('/admin', authenticate, authorizeAdmin, getAllTickets);
router.put('/admin/:id/status', authenticate, authorizeAdmin, updateTicketStatus);

export default router;