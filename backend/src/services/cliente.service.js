import ClienteRepository from "../repositories/cliente.repository.js";

export default class ClienteService {
    constructor() {
        this.clienteRepository = new ClienteRepository();
    }

    createCliente = async (clienteData) => {
        const existingCliente = await this.clienteRepository.findClienteByCuit(clienteData.cuit);
        if (existingCliente) throw new Error('El CUIT ya está registrado');
        return await this.clienteRepository.createCliente(clienteData);
    }

    getClienteById = async (id) => {
        const cliente = await this.clienteRepository.findClienteById(id);
        if (!cliente) throw new Error('Cliente no encontrado');
        return cliente;
    }

    getClienteByCuit = async (cuit) => {
        const cliente = await this.clienteRepository.findClienteByCuit(cuit);
        if (!cliente) throw new Error('Cliente no encontrado');
        return cliente;
    }

    getAllClientes = async () => {
        return await this.clienteRepository.findAllClientes();
    }

    updateCliente = async (id, clienteData) => {
        await this.getClienteById(id);
        return await this.clienteRepository.updateCliente(id, clienteData);
    }

    addRemito = async (clienteId, remitoId) => {
        await this.getClienteById(clienteId);
        return await this.clienteRepository.addRemito(clienteId, remitoId);
    }

    removeRemito = async (clienteId, remitoId) => {
        await this.getClienteById(clienteId);
        return await this.clienteRepository.removeRemito(clienteId, remitoId);
    }

    deleteCliente = async (id) => {
        await this.getClienteById(id);
        return await this.clienteRepository.deleteCliente(id);
    }
}