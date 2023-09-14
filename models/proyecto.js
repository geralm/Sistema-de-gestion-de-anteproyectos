const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProyectSchema = new Schema({
    semestre: {
        type: Number,
        required: true,
        maxlength: 4
    },
    nombreEstudiante: {
        type: String,
        required: true,
        maxlength: 50
    },
    carnet: {
        type: Number,
        required: true,
        maxlength: 50
    },
    correoEstudiante: {
        type: String,
        required: true,
        maxlength: 50
    },
    telefonoEstudiante: {
        type: Number,
        required: true,
        maxlength: 8
    },
    cursos: {
        type: String,
        required: true,
        maxlength: 100
    },
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
    telefonoEmpresa: {
        type: Number,
        required: true,
        maxlength: 8
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
    }
})

module.exports = mongoose.model('Proyect', ProyectSchema);