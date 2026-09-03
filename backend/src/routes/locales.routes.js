import {Router} from 'express';
import LocalController from '../controllers/locales.controller.js';
import { verifyToken, verifySupervisor } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, LocalController.getLocales);
router.get('/:id', verifyToken, LocalController.getLocalById);
router.post('/', verifyToken, verifySupervisor, LocalController.createLocal);
router.put('/:id', verifyToken, verifySupervisor, LocalController.updateLocal);
router.delete('/:id', verifyToken, verifySupervisor, LocalController.deleteLocal);

export default router;