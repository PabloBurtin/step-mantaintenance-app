import AuthSevice from "../services/auth.service.js";

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
}