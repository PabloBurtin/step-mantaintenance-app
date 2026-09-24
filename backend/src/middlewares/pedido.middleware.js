import PedidoService from '../services/pedido.service.js';
import { USER_ROLES, PEDIDOS_ESTADOS } from '../constants/index.js';

const pedidosService = new PedidoService();

export const verifyEstadoChange = async (req, res, next) => {
    try {
        const pedido = await pedidosService.getPedidoById(req.params.id);
        const { estado, motivoCancelacion } = req.body
        if (pedido.estado === PEDIDOS_ESTADOS.FINALIZADO && req.user.rol === USER_ROLES.TECNICO)
            {return res.status(403).json({ message: 'No tenés permisos para cambiar el estado de un pedido finalizado' });}
        
        if (pedido.estado === PEDIDOS_ESTADOS.CANCELADO && ![USER_ROLES.ADMIN, USER_ROLES.GERENTE].includes(req.user.rol)) {
            return res.status(403).json({ message: 'Solo el administrados o gerente pueden modificar un pedido cancelado' });
        }

        if (estado === PEDIDOS_ESTADOS.CANCELADO) {
            if (req.user.rol === USER_ROLES.TECNICO) {
                return res.status(403).json({ message: 'No tenés permiso para cancelar un pedido' });
            }
            if (!motivoCancelacion?.trim()) {
                return res.status(400).json({ message: 'Debe indicar el motivo de cancelación'});
            }
        }
        
        next()
    } catch (error) {
        return res.status(404).json({ message: error.message})
    }
}
