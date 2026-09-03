import BaseDAO from "./base.dao.js"
import Local from "../models/Local.js"

export default class LocalDAO extends BaseDAO {
    constructor() {
        super(Local)
    }

    findByNombre = async (nombre) => {
        try {
            return await this.model.findOne({ nombre });
        } catch (error) {
            throw new Error(`Error al encontrar local por nombre: ${error.message}`);
        }
    }

    findByCliente = async (clienteId) => {
        try {
            return await this.model.find({ cliente: clienteId });
        } catch (error) {
            throw new Error (`Error al encontrar locales por cliente: ${error.message}`);
        }
    }
}