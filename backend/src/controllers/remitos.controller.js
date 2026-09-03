import RemitoService from "../services/remito.service.js";

const remitoService = new RemitoService();

export default class RemitoController {
    static getRemitos = async (req, res) => {
        try {
            const remitos = await remitoService.getAllRemitos(req.user);
            return res.status(200).json({ status: 'success', data: remitos });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static getRemitoById = async (req, res) => {
        try {
            const remito = await remitoService.getRemitoById(req.params.id);
            return res.status(200).json({ status: 'success', data: remito.toPublicJSON() });
        } catch (error) {
            if (error.message === 'Remito no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static createRemito = async (req, res) => {
        try {
            const { cliente, local, fecha, items, pedidoId, ordenDeCompra, firma, aclaracion } = req.body;
            const remito = await remitoService.createRemito({ cliente, local, fecha, items, pedidoId, ordenDeCompra, firma, aclaracion, creadoPor: req.user.id });
            return res.status(201).json ({ status: 'success', message: 'Remito creado', data: remito.toPublicJSON() });
        } catch (error) {
            if(['Cliente no encontrado', 'Local no encontrado', 'Pedido no encontrado'].includes(error.message)) {
                return res.status(404).json ({ status: 'error', message: error.message });
            }
            return res.status (500).json({ status: 'error', message: error.message });
        }
    }

    static updateRemito = async (req, res) => {
        try {
            const { fecha, items, ordenDeCompra, firma, aclaracion } = req.body;
            const remito = await remitoService.updateRemito(req.params.id, { fecha, items, ordenDeCompra, firma, aclaracion });
            return res.status(200).json({ status: 'success', data: remito.toPublicJSON() });
        } catch (error) {
             if (error.message === 'Remito no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static deleteRemito = async (req, res) => {
        try {
            await remitoService.deleteRemito(req.params.id);
            return res.status(200).json({ status: 'success', message: 'Remito eliminado' });
        } catch (error) {
             if (error.message === 'Remito no encontrado') {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}