import BaseDAO from "./base.dao.js";
import Cliente from "../models/Cliente.js"

export default class ClienteDAO extends BaseDAO {
    constructor() {
        super(Cliente);
    }

    findByCuit = async (cuit) => {
        try {
            return await this.model.findOne({ cuit });
        } catch (error) {
            throw new Error(`Error al encontrar cliente por CUIT: ${error.message}`);
        }
    }

    addRemito = async (clienteId, remitoId) => {
        try {
            return await this.model.findByIdAndUpdate(
                clienteId,
                { $push: { remitos: remitoId } },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error al agregar remito al cliente: ${error.message}`);
        }
    }

    removeRemito = async (clienteId, remitoId) => {
        try {
            return await this.model.findByIdAndUpdate(
                clienteId,
                { $pull: { remitos: remitoId } },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error al eliminar remito del cliente: ${error.message}`)
        }
    }
}