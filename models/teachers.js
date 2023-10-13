const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        unique: false
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    }
    
})
module.exports = mongoose.model('Teacher', teacherSchema);

