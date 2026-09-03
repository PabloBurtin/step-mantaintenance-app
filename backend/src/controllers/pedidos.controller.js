import PedidoService from '../services/pedido.service.js';

const pedidoService = new PedidoService();

export default class PedidoController {
    static getPedidos = async (req, res) => {
        try {
            const pedidos = await pedidoService.getAllPedidos(req.user);
            return res.status(200).json({ status: 'success', data: pedidos });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static getPedidoById = async (req, res) => {
        try {
            const pedido = await pedidoService.getPedidoById(req.params.id);
            return res.status(200).json({ status:'succes', data: pedido.toPublicJSON() });
        } catch (error) {
            if (error.message === 'Pedido no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static createPedido = async (req, res) => {
        try {
            const { cliente, local, asignadoA, tipo, ordenDeCompra, descripcion } = req.body;
            const pedido = await pedidoService.createPedido({ cliente, local, asignadoA, tipo, ordenDeCompra, descripcion, creadoPor: req.user.id });
            return res.status(201).json({ status: 'success', message: 'Pedido creado', data: pedido.toPublicJSON() });
        } catch (error) {
            if(['Cliente no encontrado', 'Local no encontrado', 'Usuario no encontrado'].includes(error.message)) {
                return res.status(404).json({ status:'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static updatePedido = async (req, res) => {
        try {
            const { cliente, local, asignadoA, tipo, ordenDeCompra, descripcion } = req.body;
            const pedido = await pedidoService.updatePedido (req.params.id, { cliente, local, asignadoA, tipo, ordenDeCompra, descripcion });
            return res.status(200).json({ status: 'success', data: pedido.toPublicJSON() });
        } catch (error) {
                 if (error.message === 'Pedido no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static updateEstado = async (req, res) => {
        try {
            const { estado } = req.body;
            const pedido = await pedidoService.updateEstado(req.params.id, estado);
            return res.status(200).json({ status: 'success', data: pedido.toPublicJSON() });;
        } catch (error) {
                  if (error.message === 'Pedido no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static deletePedido = async (req, res) => {
        try {
            await pedidoService.deletePedido(req.params.id);
            return res.status(200).json({ status: 'success', message: 'Pedido eliminado' });
        } catch (error) {
                  if (error.message === 'Pedido no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}