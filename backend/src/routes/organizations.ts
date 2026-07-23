import { Router } from 'express';
import { create, list } from '../controllers/organizationController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('super_admin'));

router.post('/', create);
router.get('/', list);

export default router;
