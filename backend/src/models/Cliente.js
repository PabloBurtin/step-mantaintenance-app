import mongoose from "mongoose";

const direccionSchema = new mongoose.Schema({
    calle:{ type: String, required: true, trim: true },
    numero:{ type: String, required: true, trim: true },
    piso:{ type: String, trim: true },
    depto:{ type: String, trim: true },
    ciudad:{ type: String, required: true, trim: true },
    provincia:{ type: String, required: true, trim: true },
    codigoPostal:{ type: String, required: true, trim: true }
}, { _id: false });

const clienteSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true, 
        trim: true 
    },
    cuit: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    condicionIVA: {
        type: String,
        enum: ['Responsable Inscripto', 'Exento', 'Consumidor Final'],
        required: true
    },
    direccionFiscal: {
        type: direccionSchema,
        required: true
    },
    tieneLocales: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        default: true
    },
    remitos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Remito'
    }]
}, {timestamps: true});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;