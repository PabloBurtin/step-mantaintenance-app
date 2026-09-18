import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', verifyToken, AuthController.refresh);
router.post('/logout', verifyToken, AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:token', AuthController.resetPassword);
router.get('/verify-email/:token', AuthController.verifyEmail)

export default router;