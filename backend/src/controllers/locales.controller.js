import LocalService from '../services/local.service.js'

const localService = new LocalService();

export default class LocalController {
    static getLocales = async (req, res) => {
        try {
           const { clienteId } = req.query;
           const locales = clienteId
                ? await localService.getLocalByCliente(clienteId)
                :await localService.getAllLocales();
            return res.status(200).json({ status: 'success', data: locales })
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static getLocalById = async (req, res) => {
        try {
            const local = await localService.getLocalById(req.params.id);
            return res.status(200).json({ status: 'success', data: local.toPublicJSON() });
        } catch (error) {
            if (error.message === 'Local no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message});
            }
            return res.status(500).json({ status: 'error', message: error.message});
        }
    }

    static createLocal = async (req, res) => {
        try {
            const { cliente, nombre, direccion, ubicacionMaps } = req.body;
            const local = await localService.createLocal({ cliente, nombre, direccion, ubicacionMaps });
            return res.status(201).json({ status: 'success', message: 'Local creado', data: local.toPublicJSON() });
        } catch (error) {
            if (error.message === 'Cliente no encontrado' || error.message === 'Ya existe un local con ese nombre' || error.message === 'El cliente no tiene habilitada la opción de locales') {
                return res.status(400).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static updateLocal = async (req, res) => {
        try{
            const { cliente, nombre, direccion, ubicacionMaps, activo } = req.body;
            const local = await localService.updateLocal(req.params.id, { cliente, nombre, direccion, ubicacionMaps, activo });
            return res.status(200).json({ status: 'success', data: local.toPublicJSON() });
        } catch (error) {
               if (error.message === 'Local no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message});
            }
            return res.status(500).json({ status: 'error', message: error.message});
        }
    }

    static deleteLocal = async (req, res) => {
        try{
            await localService.deleteLocal(req.params.id);
            return res.status(200).json({ status: 'success', message: 'Local eliminado' });
        } catch (error) {
               if (error.message === 'Local no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message});
            }
            return res.status(500).json({ status: 'error', message: error.message});
        }
    }
}