const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const semestreSchema = new Schema({
    year: {
        type: Number,
        required: true,
        maxlength: 4
        
    },
    period:{
        type: String,
        enum: ['I','II'],
        required: true,
    },
    isAvailable:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('Semestre', semestreSchema);