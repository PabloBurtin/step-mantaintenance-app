import UserService from './user.service.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export default class AuthSevice {
    constructor () {
        this.userService = new UserService();
    }

    register = async (userData) => {
        const hashedPassword = await hashPassword(userData.password);

        const user = await this.userService.createUser({
            ...userData,
            password: hashedPassword
        });

        const payload = { id: user.id, rol: user.rol };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return { user, accessToken, refreshToken };
    }

    login = async (email, password) => {
        const user = await this.userService.getUserByEmail(email);

        if (!user.activo) {
            throw new Error('Usuario inactivo');
        }

        const userConPassword = await this.userService.getUserWithPassword(email);
        const passwordValida = await comparePassword(password, userConPassword.password);

        if (!passwordValida) {
            throw new Error('Credenciales inválidas');
        }

        const payload = { id: user.id, rol: user.rol };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return { user, accessToken, refreshToken };
    }

    refresh = async (refreshToken) => {
        const { verifyRefreshToken } = await import('../utils/jwt.js');
        const decoded = verifyRefreshToken(refreshToken);

        const user = await this.userService.getUserById(decoded.id);
        if(!user.activo) throw new Error('Usuario inactivo');

        const payload = { id: user.id, rol: user.rol };
        const accessToken = generateAccessToken(payload);

        return { accessToken };
    }

    changePassword = async (userId, passwordActual, passwordNuevo) => {
        const userConPassword = await this.userService.getUserWithPasswordById(userId);

        const passwordValida = await comparePassword(passwordActual, userConPassword.password);
        if(!passwordValida) throw new Error('La contraseña actual es incorrecta');

        const hashedPassword = await hashPassword(passwordNuevo);
        return await this.userService.updateUser(userId, { password: hashedPassword });
    }
}