import UserService from './user.service.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import crypto from 'crypto';
import User from '../models/User.js'
import PendingUser from '../models/PendingUser.js';

export default class AuthSevice {
    constructor () {
        this.userService = new UserService();
    }

    register = async (userData) => {
        const existingUser = await this.userService.getUserByEmail(userData.email).catch(() => null)
        if (existingUser) throw new Error ('El usuario ya existe');

        await PendingUser.deleteOne({ email: userData.email })

        const hashedPassword = await hashPassword(userData.password);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await PendingUser.create({
            ...userData,
            password: hashedPassword,
            verificationToken,  
            expiresAt
        });

        return { verificationToken };
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

    forgotPassword = async (email) => {
        const user = await this.userService.getUserByEmail(email);
        if(!user) throw new Error('Usuerio no encontrado')

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 *60 * 1000);

        await this.userService.updateUser(user.id, {
            resetPasswordToken: token,
            resetPasswordExpires: expires
        });

        return { token, user };
    }

    resetPassword = async (token, nuevaPassword) => {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) throw new Error ('Token inválido o expirado');

        const hashedPassword = await hashPassword(nuevaPassword);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return user;
    }

    verifyEmail = async (token) => {
        const pending = await PendingUser.findOne({
            verificationToken: token,
            expiresAt: { $gt: new Date() }
        });

        if (!pending) throw new Error ('Token inválido o expirado');

        const user = await this.userService.createUser({
            nombre: pending.nombre,
            apellido: pending.apellido,
            email: pending.email,
            celular: pending.celular,
            password: pending.password,
            rol: pending.rol
        });
        await PendingUser.deleteOne({_id: pending.id})

        return user;
    }
}