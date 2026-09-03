import LocalDAO from "../daos/local.dao.js"
import LocalDTO from "../dto/local.dto.js"

export default class LocalRepository {
    constructor() {
        this.dao = new LocalDAO();
    }

    createLocal = async (localData) => {
        const local = await this.dao.create(localData);
        return new LocalDTO(local);
    }

    findLocalById = async (id) => {
        const local = await this.dao.findById(id);
        return local ? new LocalDTO(local) : null;
    }

    findLocalByNombre = async (nombre) => {
        const local = await this.dao.findByNombre(nombre);
        return local ? new LocalDTO(local) : null
    } 

    findLocalesByCliente = async (clienteId) => {
        const locales = await this.dao.findByCliente(clienteId);
        return LocalDTO.fromArray(locales);
    }

    findAllLocales = async () => {
        const locales = await this.dao.findAll();
        return LocalDTO.fromArray(locales);
    }

    updateLocal = async (id, localData) => {
        const local = await this.dao.update (id, localData);
        return new LocalDTO(local);
    }

    deleteLocal = async (id) => {
        return await this.dao.delete(id);
    }
}