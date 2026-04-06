import { Router } from 'express';
import { 
  createTerm, 
  updateTerm, 
  getTermsList, 
  activateTerm, 
  deleteTerm 
} from '../../controllers/admin/termsManagementController';
import { protect } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';

const router = Router();

// Protect all admin terms routes
router.use(protect, authorize('ADMIN'));

router.post('/', createTerm);
router.get('/', getTermsList);
router.put('/:id', updateTerm);
router.put('/:id/activate', activateTerm);
router.delete('/:id', deleteTerm);

export default router;