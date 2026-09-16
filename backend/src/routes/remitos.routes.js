import {Router} from 'express';
import RemitoController from '../controllers/remitos.controller.js';
import { verifyToken, verifySupervisor, verifyAdminGerente, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, RemitoController.getRemitos);
router.get('/:id', verifyToken, RemitoController.getRemitoById);
router.post('/', verifyToken, RemitoController.createRemito);
router.put('/:id', verifyToken, verifyAdminGerente, RemitoController.updateRemito);
router.delete('/:id', verifyToken, verifyAdmin, RemitoController.deleteRemito);

export default router;