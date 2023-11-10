const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const semestreSchema = new Schema({
    year: {
        type: Number,
        required: true,
        maxlength: 4,
        min: 2000,    
    },
    period:{
        type: String,
        enum: ['I','II'],
        required: true,
    },
    isActual:{
        type:Boolean,
        default:true
    }
});
semestreSchema.index({ year: 1, period: 1 }, { unique: true });
//Only allows to semester per year

// Definir un método para actualizar el campo isActual
semestreSchema.statics.updateIsActual = async function () {
    const latestSemestre = await this.findOne().sort({ year: -1, period: -1 });
    
    if (latestSemestre) {
        await this.updateMany({ _id: { $ne: latestSemestre._id } }, { $set: { isActual: false } });
        
        //$ne es not equal
    }
};

// Ejecutar el método después de cada inserción
semestreSchema.post('save', function (doc, next) {
    this.constructor.updateIsActual().then(() => next());
});

module.exports = mongoose.model('Semestre', semestreSchema);