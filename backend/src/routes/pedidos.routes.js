import {Router} from 'express';
import PedidoController from '../controllers/pedidos.controller.js';
import { verifyToken, verifySupervisor, verifyGerente, verifyAdmin } from '../middlewares/auth.middleware.js';
import { verifyEstadoChange } from '../middlewares/pedido.middleware.js';

const router = Router();

router.get('/', verifyToken, PedidoController.getPedidos);
router.get('/public/:token', PedidoController.getPublicPedido);
router.get('/:id/share-token', verifyToken, verifyGerente, PedidoController.getSharetoken)
router.get('/:id', verifyToken, PedidoController.getPedidoById);
router.post('/', verifyToken, verifyGerente, PedidoController.createPedido);
router.put('/:id', verifyToken, verifyGerente, PedidoController.updatePedido);
router.patch('/:id/estado', verifyToken, verifyEstadoChange, PedidoController.updateEstado);
router.delete('/:id', verifyToken, verifyAdmin, PedidoController.deletePedido);

export default router;