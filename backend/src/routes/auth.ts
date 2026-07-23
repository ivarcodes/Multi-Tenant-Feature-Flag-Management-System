import { Router } from 'express';
import { signup, login, me, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, me);
router.post('/logout', logout);

export default router;
