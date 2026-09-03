import BaseDAO from "./base.dao.js";
import Remito from "../models/Remito.js"

export default class RemitoDAO extends BaseDAO {
    constructor() {
        super(Remito);
    }

    findByCliente = async (clienteId) => {
        try {
            return await this.model.find({ cliente: clienteId });
        } catch (error) {
            throw new Error(`Error al encontrar los remitos por cliente: ${error.message}`);
        }
    }

    findByLocal = async (localId) => {
        try {
            return await this.model.find({ local: localId });
        } catch (error) {
            throw new Error(`Error al encontrar los remitos por local: ${error.message}`);
        }
    }

    findUltimoNumero = async () => {
        try {
            return await this.model.findOne().sort({ numero: -1 });
        } catch (error) {
            throw new Error(`Error al obtener el últmimo número de remito: ${error.message}`)
        }
    }

    findByIdPopulated = async (id) => {
        try {
            return await this.model.findById(id)
                .populate('cliente', 'nombre cuit condicionIVA direccionFiscal')
                .populate('local', 'nombre direccion');
        } catch (error) {
            throw new Error(`Error al encontrar el remito: ${error.message}`);
        }
    }
}