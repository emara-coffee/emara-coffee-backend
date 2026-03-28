import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
export declare const addToCart: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCart: (req: AuthRequest, res: Response) => Promise<void>;
export declare const removeFromCart: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=cartController.d.ts.map