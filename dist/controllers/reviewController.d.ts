import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
export declare const addReview: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProductReviews: (req: Request, res: Response) => Promise<void>;
export declare const addReviewComment: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=reviewController.d.ts.map