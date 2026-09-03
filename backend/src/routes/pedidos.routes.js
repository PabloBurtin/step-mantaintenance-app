import {Router} from 'express';
import PedidoController from '../controllers/pedidos.controller.js';
import { verifyToken, verifySupervisor } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, PedidoController.getPedidos);
router.get('/:id', verifyToken, PedidoController.getPedidoById);
router.post('/', verifyToken, verifySupervisor, PedidoController.createPedido);
router.put('/:id', verifyToken, verifySupervisor, PedidoController.updatePedido);
router.patch('/:id/estado', verifyToken, PedidoController.updateEstado);
router.delete('/:id', verifyToken, verifySupervisor, PedidoController.deletePedido);

export default router;