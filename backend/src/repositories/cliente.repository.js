import ClienteDAO from "../daos/cliente.dao.js";
import ClienteDTO from "../dto/cliente.dto.js";

export default class ClienteRepository {
    constructor() {
        this.dao = new ClienteDAO();
    }

    createCliente = async (clienteData) => {
        const cliente = await this.dao.create(clienteData);
        return new ClienteDTO(cliente);
    }

    findClienteById = async (id) => {
        const cliente = await this.dao.findById(id);
        return cliente ? new ClienteDTO(cliente) : null;
    }

    findClienteByCuit = async (cuit) => {
        const cliente = await this.dao.findByCuit(cuit);
        return cliente ? new ClienteDTO(cliente) : null;
    }

    findAllClientes = async () => {
        const clientes = await this.dao.findAll();
        return ClienteDTO.fromArray(clientes);
    }

    updateCliente = async (id, clienteData) => {
        const cliente = await this.dao.update(id, clienteData);
        return new ClienteDTO(cliente);
    }

    addRemito = async (clienteId, remitoId) => {
        const cliente = await this.dao.addRemito(clienteId, remitoId);
        return new ClienteDTO(cliente);
    }

    removeRemito = async (clienteId, remitoId) => {
        const cliente = await this.dao.removeRemito(clienteId, remitoId);
        return new ClienteDTO(cliente);
    }

    deleteCliente = async (id) => {
        return await this.dao.delete(id)
    }
}