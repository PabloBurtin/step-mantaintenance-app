import BaseDTO from "./base.dto.js";

export default class UserDTO extends BaseDTO {
    constructor (user) {
        super(user);

        this.nombre = user.nombre;
        this.apellido = user.apellido;
        this.email = user.email;
        this.celular = user.celular || null;
        this.rol = user.rol;
        this.activo = user.activo;
        this.pedidosAsignados = user.pedidosAsignados || [];
    }

    toPublicJSON = () => {
        return this.excludeFields({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            celular: this.celular,
            rol: this.rol,
            activo: this.activo,
            pedidosAsignados: this.pedidosAsignados
        },['createdAt', 'updatedAt']);
    }

    toAdminJSON = () => {
        return this.excludeFields({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            celular: this.celular,
            rol: this.rol,
            activo: this.activo,
            pedidosAsignados: this.pedidoAsignados,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }, []);
    }
}