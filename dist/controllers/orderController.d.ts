import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
export declare const placeOrder: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserOrders: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllOrders: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
export declare const cancelOrder: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateRefundStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=orderController.d.ts.map