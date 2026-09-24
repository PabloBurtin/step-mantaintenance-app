import mongoose from 'mongoose';
import { PEDIDOS_ESTADOS, PEDIDOS_TIPOS } from '../constants/index.js';

const pedidoSchema = new mongoose.Schema({
    numero:{
        type: Number
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    local:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Local',
        default: null
    },
    asignadoA:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        required: true
    },
    tipo:{
        type: String,
        enum: Object.values(PEDIDOS_TIPOS),
        required: true
    },
    ordenDeCompra:{
        type: String,
        trim: true
    },
    descripcion:{
        type: String,
        trim: true,
        default: null
    },
    estado:{
        type: String,
        enum: Object.values(PEDIDOS_ESTADOS),
        default: 'Pendiente',
        required: true
    },
    motivoCancelacion:{
        type: String,
        default: null
    },
    fechaConclusion:{
        type: Date,
        default: null
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    remitoGenerado: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

pedidoSchema.pre('save', async function() {
    if (this.isNew) {
        const ultimo = await mongoose.model('Pedido').findOne().sort({ numero: -1 });
        this.numero = ultimo ? ultimo.numero + 1 : 1;
    }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;