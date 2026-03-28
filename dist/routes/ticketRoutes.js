"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticate, ticketController_1.createTicket);
router.get('/my-tickets', authMiddleware_1.authenticate, ticketController_1.getUserTickets);
router.get('/:ticketId/messages', authMiddleware_1.authenticate, ticketController_1.getTicketMessages);
router.post('/messages', authMiddleware_1.authenticate, ticketController_1.addTicketMessage);
router.get('/admin', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, ticketController_1.getAllTickets);
router.put('/admin/:id/status', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, ticketController_1.updateTicketStatus);
exports.default = router;
//# sourceMappingURL=ticketRoutes.js.map