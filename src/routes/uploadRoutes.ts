import { Router } from 'express';
import { uploadFiles } from '../controllers/uploadController';
import { upload } from '../middlewares/uploadMiddleware';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, upload.array('files', 5), uploadFiles);

export default router;