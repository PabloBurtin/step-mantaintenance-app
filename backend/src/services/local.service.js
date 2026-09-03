import LocalRepository from "../repositories/local.repository.js";
import ClienteService from "./cliente.service.js";

export default class LocalService {
    constructor () {
        this.localRepository = new LocalRepository();
        this.clienteService = new ClienteService();
    }

    createLocal = async (localData) => {
        const cliente = await this.clienteService.getClienteById(localData.cliente);

        if (!cliente.tieneLocales) {
            throw new Error('El cliente no tiene habilitada la opción de locales');
        }

        const existingLocal = await this.localRepository.findLocalByNombre(localData.nombre);
        if (existingLocal) throw new Error('Ya existe un local con ese nombre');

        return await this.localRepository.createLocal(localData);
    }

    getLocalById = async (id) => {
        const local = await this.localRepository.findLocalById(id);
        if (!local) throw new Error('Local no encontrado');
        return local;
    }

    getLocalByCliente = async (clienteId) => {
        await this.clienteService.getClienteById(clienteId);
        return await this.localRepository.findLocalesByCliente(clienteId);
    }

    getAllLocales = async () => {
        return await this.localRepository.findAllLocales();
    }

    updateLocal = async (id, localData) => {
        await this.getLocalById(id);

        if (localData.cliente) {
            await this.clienteService.getClienteById(localData.cliente);
        }

        if(localData.nombre) {
            const existingLocal = await this.localRepository.findLocalByNombre(localData.nombre);
            if (existingLocal && existingLocal.id !== id) {
                throw new Error('Ya existe un local con ese nombre');
            }
        }

        return await this.localRepository.updateLocal(id, localData);
    }

    deleteLocal = async (id) => {
        await this.getLocalById(id);
        return await this.localRepository.deleteLocal(id);
    }
}