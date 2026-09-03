import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const remitoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    local: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Local',
        default: null
    },
    numero:{
        type: Number,
        unique: true
    },
    fecha:{
        type: Date,
        required: true
    },
    items: {
        type: [itemSchema],
        required: true
    },
    ordenDeCompra:{
        type: String,
        trim: true
    },
    firma:{
        type: String,
        required: true,
    },
    aclaracion:{
        type: String,
        trim: true
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {timestamps: true});

remitoSchema.pre('save', async function() {
    if (this.isNew) {
        const ultimo = await mongoose.model('Remito').findOne().sort({ numero: -1});
        this.numero = ultimo ? Number (ultimo.numero) + 1 : 1;
    }
});

const Remito = mongoose.model('Remito', remitoSchema);

export default Remito;