import mongoose from 'mongoose';

const direccionSchema = new mongoose.Schema({
    calle: {type: String, required: true, trim: true},
    numero: {type: String, required: true, trim: true},
    localidad: {type: String, required: true, trim: true},
    provincia: {type: String, required: true, trim: true}
});

const localSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cliente', 
        required: true},
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    direccion: {
        type: direccionSchema,
        required: true
    },
    ubicacionMaps: {
        type: String,
        required: true,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Local = mongoose.model('Local', localSchema);

export default Local;