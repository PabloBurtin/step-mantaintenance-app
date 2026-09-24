import { verifyAccessToken } from '../utils/jwt.js';
import UserService from '../services/user.service.js';
import { USER_ROLES } from '../constants/index.js';

const userService = new UserService();

export const verifyToken = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        const user = await userService.getUserById(decoded.id);
        if(!user || !user.activo) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

export const verifyAdmin = (req, res, next) => {
    if(req.user.rol !== USER_ROLES.ADMIN) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};

export const verifySupervisor = (req, res, next) => {
    if(![USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR, USER_ROLES.COMERCIAL].includes(req.user.rol)){
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};

export const verifyAdminGerente = (req, res, next) => {
    if (![USER_ROLES.ADMIN, USER_ROLES.GERENTE].includes(req.user.rol)) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};

export const verifyGerente = (req, res, next) => {
    if (![USER_ROLES.ADMIN, USER_ROLES.GERENTE, USER_ROLES.SUPERVISOR, USER_ROLES.COMERCIAL].includes(req.user.rol)) {
        return res.status(403).json({ message: 'Acceso denegado' })
    }
    next();
}