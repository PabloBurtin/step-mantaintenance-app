import mongoose from 'mongoose';
import { USER_ROLES } from '../constants/index.js';

const pendingUserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    celular: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: Object.values(USER_ROLES), 
        default: 'Tecnico'
    },
    verificationToken: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);

export default PendingUser;