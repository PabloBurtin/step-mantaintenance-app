import {Router} from 'express';
import LocalController from '../controllers/locales.controller.js';
import { verifyToken, verifySupervisor, verifyGerente, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, LocalController.getLocales);
router.get('/:id', verifyToken, LocalController.getLocalById);
router.post('/', verifyToken, verifyGerente, LocalController.createLocal);
router.put('/:id', verifyToken, verifyGerente, LocalController.updateLocal);
router.delete('/:id', verifyToken, verifyAdmin, LocalController.deleteLocal);

export default router;