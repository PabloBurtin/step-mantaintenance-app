import PedidoDAO from '../daos/pedido.dao.js';
import PedidoDTO from '../dto/pedido.dto.js';

export default class PedidoRepository {
    constructor () {
        this.dao = new PedidoDAO();
    }

    createPedido = async (pedidoData) => {
        const pedido = await this.dao.create(pedidoData);
        return new PedidoDTO(pedido);
    }

    findPedidoById = async (id) => {
        const pedido = await this.dao.findById(id);
        return pedido ? new PedidoDTO(pedido) : null;
    }

    findPedidosByCliente = async (clienteId) => {
        const pedidos = await this.dao.findByCliente(clienteId);
        return PedidoDTO.fromArray(pedidos);
    }

    findPedidosByUsuario = async (usuarioId) => {
        const pedidos = await this.dao.findByUsuario(usuarioId);
        return PedidoDTO.fromArray(pedidos);
    }

    findAllPedidos = async (filtro = {}) => {
        const pedidos = await this.dao.findAll(filtro, {
            populate: [
                { path: 'cliente', select: 'nombre' },
                { path: 'local', select: 'nombre' },
                { path: 'asignadoA', select: 'nombre apellido' },
                { path: 'creadoPor', select: 'nombre apellido' }
            ]
        });
        return PedidoDTO.fromArray(pedidos);
    }

    updatePedido = async (id, pedidoData) => {
        const pedido = await this.dao.update(id, pedidoData);
        return new PedidoDTO(pedido);
    }

    updateEstado = async (pedidoId, estado) => {
        const pedido = await this.dao.updateEstado(pedidoId, estado);
        return new PedidoDTO(pedido);
    }

    addPedidoToUsuario = async (usuarioId, pedidoId) => {
        return await this.dao.addPedidoToUsuario(usuarioId, pedidoId);
    }

    removePedidoFromUsuario = async (usuarioId, pedidoId) => {
        return await this.dao.removePedidoFromUsuario(usuarioId,pedidoId);
    }

    deletePedido = async (id) => {
        return await this.dao.delete(id);
    }
}