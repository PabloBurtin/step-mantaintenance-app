import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['admin', 'gerente', 'Supervisor', 'tecnico'],
        default: 'tecnico'
    },
    activo: {
        type: Boolean,
        default: true
    },
    pedidosAsignados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido'
    }],
    resetPasswordToken:{
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
