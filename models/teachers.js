const moongose = require('mongoose');
const Schema = moongose.Schema;

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
    }
})
module.exports = mongoose.model('Teacher', teacherSchema);
