import { Router } from 'express';
import { addAddress, getUserAddresses } from '../controllers/addressController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, addAddress);
router.get('/', authenticate, getUserAddresses);

export default router;