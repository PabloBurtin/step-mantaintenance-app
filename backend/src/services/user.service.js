import UserRepository from "../repositories/user.repository.js";
import UserDAO from "../daos/user.dao.js";

export default class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.userDAO = new UserDAO();
    } 

    createUser = async (userData) => {
        const existingUser = await this.userRepository.findUserByEmail(userData.email);
        if(existingUser) throw new Error('El usuario ya existe');
        return await this.userRepository.createUser(userData);
    }

    getUserById = async (id) => {
        const user = await this.userRepository.findUserById(id);
        if(!user) throw new Error('Usuario no encontrado');
        return user;
    }

    getUserByEmail = async (email) => {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    getUserWithPassword = async (email) => {
        const user = await this.userDAO.findByEmail(email);
        if(!user) throw new Error('Usuario no encontrado');
        return user;
    }

    getUserWithPasswordById = async (id) => {
        const user = await this.userDAO.findById(id);
         if(!user) throw new Error('Usuario no encontrado');
        return user;
    }

    getAllUsers = async () => {
        return await this.userRepository.findAllUsers();
    }

    updateUser = async (id, userData) => {
        await this.getUserById(id);
        return await this.userRepository.updateUser(id, userData);
    }

    updateRol = async (userId, nuevoRol) => {
        await this.getUserById(userId);
        return await this.userRepository.updateRol(userId, nuevoRol);
    }

    updateActivo = async (userId, activo) => {
        await this.getUserById(userId);
        return await this.userRepository.updateActivo(userId, activo);
    }

    deleteUser = async (id) => {
        await this.getUserById(id);
        return await this.userRepository.deleteUser(id);
    }
}