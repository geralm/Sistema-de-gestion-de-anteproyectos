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
semestreSchema.index({year:1,period:1},{unique:true});

module.exports = mongoose.model('Semestre', semestreSchema);