const { binary } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProyectSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        maxlength: 100
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cursos: [{
        type: String,
        maxlength: 50
    }],
    nombreEmpresa: {
        type: String,
        required: true,
        maxlength: 50
    },
    direccionEmpresa: {
        type: String,
        required: true,
        maxlength: 50
    },
    nombreSupervisor: {
        type: String,
        required: true,
        maxlength: 50
    },
    telefonoEmpresa: {
        type: Number,
        required: true,
        maxlength: 8
    },
    estado: {
        type: String,
        required: true,
        enum: ['Revisión', 'Aprobado', 'Rechazado', 'Finalizado'],
        default: 'Revisión'
    },
    fechaInicio: {
        type: Date,
        required: true,
    },
    fechaFinal: {
        type: Date,
        required: true,
    },
    isConfidencial:{
        type:Boolean,
        default:false
    },
    
    semestre:{
        type: Schema.Types.ObjectId,
        ref: 'Semestre',
        required: true
    }
})

module.exports = mongoose.model('Proyect', ProyectSchema);