import AuthSevice from "../services/auth.service.js";
import { sendResetPasswordEmail } from "../services/email.service.js";

const authService = new AuthSevice();

export default class AuthController {
    static register = async (req, res) => {
        try {
            const { nombre, apellido, email, password, rol, celular } = req.body;
            const { user, accessToken, refreshToken } = await authService.register({ 
                nombre, apellido, email, password, rol, celular
            });

            return res.status(201).json({
                status: 'success',
                message: 'Usuario registrado correctamente',
                user: user.toPublicJSON(),
                accessToken,
                refreshToken
            });
        } catch (error) {
            if (error.message === 'El usuario ya existe') {
                return res.status(400).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await authService.login(email, password);

            return res.status(200).json({
                status: 'success',
                message: 'Login existoso',
                user: user.toPublicJSON(),
                accessToken,
                refreshToken
            });
        } catch (error) {
            if (error.message === 'Credenciales inválidas' || error.message === 'Usuario inactivo') {
                return res.status(401).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status:'error', message: error.message});
        }
    }

    static refresh = async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if(!refreshToken) {
                return res.status(401).json({ status: 'error', message: 'Token requerido' });
            }

            const { accessToken } = await authService.refresh(refreshToken);

            return res.status(200).json({
                status: 'success',
                accessToken
            });
        } catch (error) {
            return res.status(401).json({ status:'error', message: 'Token inválido o expirado' });
        }
    }

    static logout = async (req, res) => {
        return res.status(200).json({
            status: 'success',
            message: 'Sesión cerrada'
        });
    }

    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: 'Se requiere el email' });

            const { token, user } = await authService.forgotPassword(email);

            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
            await sendResetPasswordEmail(user.email, resetUrl);

            return res.status(200).json({ message: 'Se envió el correo de recuperación' });
        } catch (error) {
            if (error.message === 'Usuario no encontrado') {
                return res.status(200).json({ message: 'Se envió el correo de recuperación' });
            }
            return res.status(500).json ({ message: error.message });
        }
    }

    static resetPassword = async (req, res) => {
        try{
            const { token } = req.params;
            const { password } = req.body;
            if (!password) return res.status(400).json ({ message: 'Se requiere la contraseña' });

            await authService.resetPassword(token, password);
            
            return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            if (error.message === 'Token inválido o expirado') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }
}