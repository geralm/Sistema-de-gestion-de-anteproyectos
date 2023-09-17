const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const newUserSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        maxlength: 50,
        unique: false
    },
    carnet: {
        type: Number,
        required: true,
        maxlength: 50,
        unique: true
    },
    telefono: {
        type: Number,
        required: true,
        maxlength: 8,
        minlength: 8,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    contrasenia: {
        type: String,
        required: true,
        minlength: 6,
        unique: false,
    },
    esAdmin: {
        type: Boolean,
        required: true,
        default: false,
        unique: false,
    }

});


newUserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
  
newUserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.contrasenia);
};





module.exports = mongoose.model('user', newUserSchema);
