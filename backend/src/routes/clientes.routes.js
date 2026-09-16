import {Router} from 'express';
import ClienteController from '../controllers/clientes.controller.js';
import { verifyToken, verifyAdmin, verifyAdminGerente } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, ClienteController.getClientes);
router.get('/:id', verifyToken, ClienteController.getClienteById);
router.post('/', verifyToken, verifyAdminGerente, ClienteController.createCliente);
router.put('/:id', verifyToken, verifyAdminGerente, ClienteController.updateCliente);
router.delete('/:id', verifyToken, verifyAdmin, ClienteController.deleteCliente);

export default router;