import PedidoDAO from '../daos/pedido.dao.js';
import RemitoDAO from '../daos/remito.dao.js';
import RemitoDTO from '../dto/remito.dto.js';

export default class RemitoRepository {
    constructor() {
        this.dao = new RemitoDAO();
    }

    createRemito = async (RemitoData) => {
        const remito = await this.dao.create(RemitoData);
        return new RemitoDTO(remito);
    }

    findRemitoById = async (id) => {
        const remito = await this.dao.findByIdPopulated(id);
        return remito ? new RemitoDTO(remito) : null;
    }

    findRemitosByCliente = async (clienteId) => {
        const remitos = await this.dao.findByCliente(clienteId);
        return RemitoDTO.fromArray(remitos);
    }

    findRemitosByLocal = async (localId) => {
        const remitos = await this.dao.findByLocal(localId);
        return RemitoDTO.fromArray(remitos);
    }

    findAllRemitos = async (filtro = {}) => {
        const remitos = await this.dao.findAll(filtro, {
            populate: [
                { path: 'cliente', select: 'nombre'},
                { path: 'local', select: 'nombre' }
            ]
        });
        return RemitoDTO.fromArray(remitos);
    }

    findUltimoRemito = async () => {
        return await this.dao.findUltimoNumero();
    }

    updateRemito = async (id, remitoData) => {
        const remito = await this.dao.update(id, remitoData);
        return new RemitoDTO(remito);
    }

    deleteRemito = async (id) => {
        return await this.dao.delete(id);
    }
}