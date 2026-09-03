import {Router} from 'express';
import ClienteController from '../controllers/clientes.controller.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, ClienteController.getClientes);
router.get('/:id', verifyToken, ClienteController.getClienteById);
router.post('/', verifyToken, verifyAdmin, ClienteController.createCliente);
router.put('/:id', verifyToken, verifyAdmin, ClienteController.updateCliente);
router.delete('/:id', verifyToken, verifyAdmin, ClienteController.deleteCliente);

export default router;