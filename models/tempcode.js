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
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Definir tiempo de expiración de 5 minutos
tempCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });


// tempCodeSchema.methods.isCodeValid = async (email, code) => {
//     const tempCode = await this.findOne({ email: email, code: code });
//     return !!tempCode;
// };

module.exports = mongoose.model('TempCode', tempCodeSchema);

