import BaseDTO from "./base.dto.js";

export default class ClienteDTO extends BaseDTO {
    constructor(cliente){
        super(cliente);

        this.nombre = cliente.nombre;
        this.cuit = cliente.cuit;
        this.condicionIVA = cliente.condicionIVA;
        this.direccionFiscal = cliente.direccionFiscal;
        this.tieneLocales = cliente.tieneLocales;
        this.activo = cliente.activo;
        this.remitos = cliente.remitos || [];
    }

    toPublicJSON = () => {
        return this.excludeFields({
            id: this.id,
            nombre: this.nombre,
            cuit: this.cuit,
            condicionIVA: this.condicionIVA,
            direccionFiscal: this.direccionFiscal,
            tieneLocales: this.tieneLocales,
            activo: this.activo,
            remitos: this.remitos
        }, ['createdAt', 'updatedAt']);
    }

    toAdminJSON = () => {
           return this.excludeFields({
            id: this.id,
            nombre: this.nombre,
            cuit: this.cuit,
            condicionIVA: this.condicionIVA,
            direccionFiscal: this.direccionFiscal,
            tieneLocales: this.tieneLocales,
            activo: this.activo,
            remitos: this.remitos,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }, []);
    }

}