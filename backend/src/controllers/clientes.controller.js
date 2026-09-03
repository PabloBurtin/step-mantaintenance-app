import ClienteService from '../services/cliente.service.js';

const clienteService = new ClienteService();

export default class ClienteController {
    static getClientes = async (req,res) => {
        try{
           const clientes = await clienteService.getAllClientes();
           return res.status(200).json({ status: 'success', data: clientes });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static getClienteById = async (req, res) => {
        try {
            const cliente = await clienteService.getClienteById(req.params.id);
            return res.status(200).json({ status: 'success', data: cliente.toPublicJSON() });
        } catch (error) {
            if (error.message === 'Cliente no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message})
        }
    }

    static createCliente = async (req, res) => {
        try{
            const { nombre, cuit, condicionIVA, direccionFiscal, tieneLocales } = req.body;
            const cliente = await clienteService.createCliente({ nombre, cuit, condicionIVA, direccionFiscal, tieneLocales });
            return res.status(201).json({ status: 'success', message: 'Cliente creado', data: cliente.toPublicJSON() });
        } catch (error) {
            if (error.message === 'El CUIT ya está registrado') {
                return res.status(400).json({ status: 'error', message: error.message});
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static updateCliente = async (req, res) => {
        try {
            const { nombre, cuit, condicionIVA, direccionFiscal, tieneLocales, activo } = req.body;
            const cliente = await clienteService.updateCliente(req.params.id, { nombre, cuit, condicionIVA, direccionFiscal, tieneLocales, activo });
            return res.status(200).json({ status: 'success', data: cliente.toAdminJSON() });
        } catch (error) {
                 if (error.message === 'Cliente no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            console.error(error.stack)
            return res.status(500).json({ status: 'error', message: error.message})
        }
    }

    static deleteCliente = async (req, res) => {
        try {
            await clienteService.deleteCliente(req.params.id);
            return res.status(200).json({ status: 'success', message: 'Cliente eliminado'});
        } catch (error) {
                 if (error.message === 'Cliente no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message})
        }
    }
}


