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
        required: false
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
    puestoSupervisor: {
        type: String,
        required: true,
        maxlength: 50
    },
    correoSupervisor: {
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
        enum: ['Revision', 'Aprobado', 'Rechazado', 'Finalizado'],
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
        type: String,
        ref: 'Semestre',
        required: true
    },

    documento:{
        type:Buffer,
        required:true
    },

    tipo:{
        type: String,
        required: true,
        enum: ['desarrollo', 'investigacion', 'infraestructura'],
        default: 'desarrollo'
    },
    teletrabajo:{
        type:Boolean,
        default:false
    },
})

module.exports = mongoose.model('Proyect', ProyectSchema);