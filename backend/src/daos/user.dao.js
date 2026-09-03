import BaseDAO from "./base.dao.js";
import User from "../models/User.js";

export default class UserDAO extends BaseDAO {
    constructor() {
        super(User);
    }

    findByEmail = async (email) => {
        try {
            return await this.model.findOne({ email });
        } catch (erro) {
            throw new Error(`Error al encontrar usuario por email: ${error.message}`);
        }
    }

    updateRol = async  (userId, nuevoRol) => {
            try{
                return await this.model.findByIdAndUpdate(
                    userId,
                    {rol: nuevoRol},
                    {new: true}
                )
            }catch(error){
                throw new Error (`Error en actualizar el rol del usuario: ${error.message}`)
            }
        }

    updateActivo = async (userId, activo) => {
        try {
            return await this.model.findByIdAndUpdate(
                userId,
                { activo },
                {new: true }
            );
        } catch (error) {
            throw new Error(`Error al actualizar el estado del usuario: ${error.message}`);
        }
    }
}
