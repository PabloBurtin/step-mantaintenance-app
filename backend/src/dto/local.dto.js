import BaseDTO from "./base.dto.js";

export default class LocalDTO extends BaseDTO {
    constructor(local){
        super(local);

        this.nombre = local.nombre;
        this.cliente = local.cliente;
        this.direccion = local.direccion;
        this.ubicacionMaps = local.ubicacionMaps;
        this.activo = local.activo;
    }

    toPublicJSON = () => {
        return this.excludeFields({
            id: this.id,
            nombre: this.nombre,
            cliente: this.cliente,
            direccion: this.direccion,
            ubicacionMaps: this.ubicacionMaps,
            activo: this.activo
        }, ['createdAt', 'updatedAt']);
    }

    toAdminJSON = () => {
        return this.excludeFields({
            id: this.id,
            nombre: this.nombre,
            cliente: this.cliente,
            direccion: this.direccion,
            ubicacionMaps: this.ubicacionMaps,
            activo: this.activo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }, []);
    }


}