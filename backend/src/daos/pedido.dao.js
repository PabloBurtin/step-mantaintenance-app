import BaseDAO from "./base.dao.js";
import Pedido from "../models/Pedido.js"
import { PEDIDOS_ESTADOS } from "../constants/index.js";

export default class PedidoDAO extends BaseDAO {
    constructor() {
        super(Pedido)
    }

    findByCliente = async (clienteId) => {
        try {
            return await this.model.find({ cliente: clienteId });
        } catch (error) {
            throw new Error(`Error al encontrar los pedidos por cliente: ${error.message}`);
        }
    }

    findByUsuario = async (usuarioId) => {
        try {
            return await this.model.find({ asignadoA: usuarioId });
        } catch (error) {
            throw new Error(`Error al encontrar los pedidos por usuario: ${error.message}`);
        }
    }

    updateEstado = async (pedidoId, estado, motivoCancelacion = null) => {
        try {
            const data = { estado };
            if (estado === PEDIDOS_ESTADOS.FINALIZADO || estado === PEDIDOS_ESTADOS.CANCELADO) {
                data.fechaConclusion = new Date();
            }
            if (estado === PEDIDOS_ESTADOS.CANCELADO && motivoCancelacion) {
                data.motivoCancelacion = motivoCancelacion;
            }
            return await this.model.findByIdAndUpdate(
                pedidoId,
                data,
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error al actualizar el estado del pedido: ${error.message}`);
        }
    }

    addPedidoToUsuario = async (usuarioId, pedidoId) => {
        try {
            const User = (await import ('../models/User.js')).default;
            return await User.findByIdAndUpdate(
                usuarioId,
                { $push: { pedidosAsignados: pedidoId } },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error al asignar el pedido al usuario: ${error.message}`);
        }
    }

     removePedidoFromUsuario = async (usuarioId, pedidoId) => {
        try {
            const User = (await import ('../models/User.js')).default;
            return await User.findByIdAndUpdate(
                usuarioId,
                { $pull: { pedidosAsignados: pedidoId } },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error al remover el pedido al usuario: ${error.message}`);
        }
    }
}