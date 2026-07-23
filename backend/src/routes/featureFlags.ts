import { Router } from 'express';
import { check, list, create, update, remove } from '../controllers/featureFlagController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/check/:key', authenticate, authorize('user', 'admin'), check);

router.use(authenticate, authorize('admin'));

router.get('/', list);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
