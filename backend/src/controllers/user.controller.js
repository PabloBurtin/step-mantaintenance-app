import UserService from "../services/user.service.js";
import AuthService from "../services/auth.service.js";
import { hashPassword } from "../utils/hash.js";

const userService = new UserService();
const authService = new AuthService();

export default class UserController {
    static getUsers = async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({status: 'success', data: users });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static getUserById = async (req, res) => {
        try {
            const user = await userService.getUserById(req.params.id);
            return res.status(200).json({ status: 'success', data: user.toPublicJSON() });
        } catch (error) {
            if (error.message === 'Usuario no encontrado') {
                return res.status(404).json ({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static createUser = async (req, res) => {
        try {
            const { nombre, apellido, email, password, rol, celular } = req.body;
            const hashedPassword = await hashPassword(password)
            const  user  = await userService.createUser ({ nombre, apellido, email, password: hashedPassword, rol, celular });
            return res.status(201).json({ status: 'success', message: 'Usuario creado', data: user.toPublicJSON() });
        } catch (error) {
            if (error.message === 'El usuario ya existe') {
                return res.status(400).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static updateUser = async (req, res) => {
        try{
            const { nombre, apellido, email, activo, celular } = req.body;
            const user = await userService.updateUser(req.params.id, { nombre, apellido, email, activo, celular });
            return res.status(200).json({ status: 'success', data: user.toPublicJSON() });
        } catch (error) {
            if (error.message === 'Usuario no encontrado') {
                return res.status(404).json ({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static updateRol = async (req, res) => {
        try{
            const { rol } = req.body;
            const user = await userService.updateRol(req.params.id, rol);
            return res.status(200).json({ status: 'success', data: user.toPublicJSON() })
        } catch (error) {
             if (error.message === 'Usuario no encontrado') {
                return res.status(404).json ({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static updatePassword = async (req, res) => {
        try {
            const { passwordActual, passwordNuevo } = req.body;
            await authService.changePassword(req.params.id, passwordActual, passwordNuevo);
            return res.status(200).json({ status: 'success', message: 'Constraseña actualizada' });
        } catch (error) {
            if (error.message === 'La contraseña actual es incorrecta') {
                return res.status(401).json({ status: 'error', message: error.message});
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static deleteUser = async (req, res) => {
        try {
            await userService.deleteUser(req.params.id);
            return res.status(200).json({ status: 'success', message: 'Usuario eliminado' });
        } catch (error) {
             if (error.message === 'Usuario no encontrado') {
                return res.status(404).json ({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}