import RemitoRepository from "../repositories/remito.repository.js";
import ClienteService from "./cliente.service.js";
import LocalService from "./local.service.js";
import PedidoService from "./pedido.service.js";

export default class RemitoService {
    constructor() {
        this.remitoRepository = new RemitoRepository();
        this.clienteService = new ClienteService();
        this.localService = new LocalService();
        this.pedidoService = new PedidoService();
    }

    createRemito = async (remitoData) => {
        await this.clienteService.getClienteById(remitoData.cliente);
        if (remitoData.local) await this.localService.getLocalById(remitoData.local);
        
        let ordenDeCompra = remitoData.ordenDeCompra || undefined;
        if (remitoData.pedidoId) {
            const pedido = await this.pedidoService.getPedidoById(remitoData.pedidoId);
            if (pedido.remitoGenerado) throw new Error('Este pedido ya tiene un remito generado');
            ordenDeCompra = pedido.ordenDeCompra || ordenDeCompra;
        }

        const remito = await this.remitoRepository.createRemito({
            ...remitoData,
            ordenDeCompra
        });

        await this.clienteService.addRemito(remitoData.cliente, remito.id);

        if (remitoData.pedidoId) {
            await this.pedidoService.updatePedido(remitoData.pedidoId, { remitoGenerado: true })
        }
        return remito;
    }

    getRemitoById = async (id) => {
        const remito = await this.remitoRepository.findRemitoById(id);
        if (!remito) throw new Error('Remito no encontrado');
        return remito;
    }

    getRemitosByCliente = async (clienteId) => {
        await this.clienteService.getClienteById(clienteId);
        return await this.remitoRepository.findRemitosByCliente(clienteId);
    }

    getRemitosByLocal = async (localId) => {
        await this.localService.getLocalById(localId);
        return await this.remitoRepository.findRemitosByLocal(localId);
    }

    getAllRemitos = async (user) => {
        const filtro = user.rol === 'tecnico' ? {creadoPor: user.id} : {};
        return await this.remitoRepository.findAllRemitos(filtro);
    }

    updateRemito = async (id, remitoData) => {
        await this.getRemitoById(id);
        return await this.remitoRepository.updateRemito(id, remitoData);
    }

    deleteRemito = async (id) => {
        const remito = await this.getRemitoById(id);
        await this.clienteService.removeRemito(remito.cliente, id);
        return await this.remitoRepository.deleteRemito(id);
    }
}