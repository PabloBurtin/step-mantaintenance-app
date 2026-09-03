import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, UserController.getUsers);
router.get('/:id', verifyToken, UserController.getUserById);
router.post('/', verifyToken, verifyAdmin, UserController.createUser);
router.put('/:id', verifyToken, verifyAdmin, UserController.updateUser);
router.patch('/:id/password', verifyToken, UserController.updatePassword);
router.patch('/:id/rol', verifyToken, UserController.updateRol)
router.delete('/:id', verifyToken, verifyAdmin, UserController.deleteUser);

export default router;