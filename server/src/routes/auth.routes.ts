import { Router } from 'express';
import { register, login, googleLogin, getMe, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

export default router;
