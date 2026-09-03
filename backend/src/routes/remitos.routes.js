import {Router} from 'express';
import RemitoController from '../controllers/remitos.controller.js';
import { verifyToken, verifySupervisor } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, RemitoController.getRemitos);
router.get('/:id', verifyToken, RemitoController.getRemitoById);
router.post('/', verifyToken, RemitoController.createRemito);
router.put('/:id', verifyToken, verifySupervisor, RemitoController.updateRemito);
router.delete('/:id', verifyToken, verifySupervisor, RemitoController.deleteRemito);

export default router;