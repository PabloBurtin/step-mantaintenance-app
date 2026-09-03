import UserDAO from "../daos/user.dao.js";
import UserDTO from "../dto/user.dto.js";

export default class UserRepository {
    constructor() {
        this.dao = new UserDAO
    }

    createUser = async (userData) => {
        const user = await this.dao.create(userData);
        return new UserDTO(user);
    }

    findUserById = async (id) => {
        const user = await this.dao.findById(id);
        return user ? new UserDTO(user) : null;
    }

    findUserByEmail = async (email) => {
        const user = await this.dao.findByEmail(email);
        return user ? new UserDTO(user) : null;
    }

    findAllUsers = async () => {
        const users = await this.dao.findAll();
        return UserDTO.fromArray(users);
    }

    updateUser = async (id, userData) => {
        const user = await this.dao.update(id, userData);
        return new UserDTO(user);
    }

    updateRol = async (userId, nuevoRol) => {
        const user = await this.dao.updateRol(userId, nuevoRol);
        return new UserDTO(user);
    }

    updateActivo = async (userId, activo) => {
        const user = await this.dao.updateActivo(userId, activo);
        return new UserDTO(user);
    }

    deleteUser = async (id) => {
        return await this.dao.delete(id);
    }
}