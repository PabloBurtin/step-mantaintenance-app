import mongoose from 'mongoose';

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
        enum:['Mantenimiento preventivo', 'Reparación', 'Urgencia'],
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
        enum:['Pendiente', 'En curso', 'Finalizado', 'Cancelado'],
        default: 'Pendiente',
        required: true
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