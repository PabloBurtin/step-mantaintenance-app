import BaseDTO from "./base.dto.js";

export default class RemitoDTO extends BaseDTO {
    constructor(remito) {
        super(remito);

        this.numero = remito.numero;
        this.cliente = remito.cliente;
        this.local = remito.local;
        this.fecha = remito.fecha;
        this.items = remito.items || [];
        this.ordenDeCompra = remito.ordenDeCompra || null;
        this.firma = remito.firma || null;
        this.aclaracion = remito.aclaracion || null;
        this.creadoPor = remito.creadoPor || null
    }

    toPublicJSON = () => {
        return this.excludeFields({
            id: this.id,
            numero: this.numero,
            cliente: this.cliente,
            local: this.local,
            fecha: this.fecha,
            items: this.items,
            ordenDeCompra: this.ordenDeCompra,
            firma: this.firma,
            aclaracion: this.aclaracion,
            createdAt: this.createdAt
        }, ['updatedAt']);
    }

    toAdminJSON = () => {
         return this.excludeFields({
            id: this.id,
            numero: this.numero,
            cliente: this.cliente,
            local: this.local,
            fecha: this.fecha,
            items: this.items,
            ordenDeCompra: this.ordenDeCompra,
            firma: this.firma,
            aclaracion: this.aclaracion,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }, []);
    }
}