const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempCodeSchema = new Schema({
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    code: {
        type: String,
        required: true,
        maxlength: 6,
    }
}, {
    expires: 300, // El tiempo de expiración en segundos (5 minutos = 300 segundos)
});

module.exports = mongoose.model('Tempcode', tempCodeSchema);

