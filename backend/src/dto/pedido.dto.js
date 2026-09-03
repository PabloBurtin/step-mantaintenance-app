import BaseDTO from "./base.dto.js";

export default class PedidoDTO extends BaseDTO {
    constructor(pedido){
        super(pedido);

        this.numero = pedido.numero;
        this.cliente = pedido.cliente;
        this.local = pedido.local;
        this.asignadoA = pedido.asignadoA;
        this.creadoPor = pedido.creadoPor;
        this.remitoGenerado = pedido.remitoGenerado || false;
        this.tipo = pedido.tipo;
        this.ordenDeCompra = pedido.ordenDeCompra || null;
        this.descripcion = pedido.descripcion || null;
        this.estado = pedido.estado;
        this.fechaConclusion = pedido.fechaConclusion || null;
    }

    toPublicJSON = () => {
        return this.excludeFields({
            id: this.id,
            numero: this.numero,
            cliente: this.cliente,
            local: this.local,
            asignadoA: this.asignadoA,
            creadoPor: this.creadoPor,
            tipo: this.tipo,
            ordenDeCompra: this.ordenDeCompra,
            descripcion: this.descripcion,
            estado: this.estado,
            fechaConclusion: this.fechaConclusion,
            createdAt: this.createdAt,
            remitoGenerado: this.remitoGenerado
        }, ['updatedAt'])
    }

    toAdminJSON = () => {
          return this.excludeFields({
            id: this.id,
            numero: this.numero,
            cliente: this.cliente,
            local: this.local,
            asignadoA: this.asignadoA,
            creadoPor: this.creadoPor,
            remitoGenerado: this.remitoGenerado,
            tipo: this.tipo,
            ordenDeCompra: this.ordenDeCompra,
            descripcion: this.descripcion,
            estado: this.estado,
            fechaConclusion: this.fechaConclusion,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }, [])
    }
}