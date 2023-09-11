const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 30
    },
    descrption: {
        type:String,
        maxlength:300
    },
    startDate: {
        type : Date, 
        required: true,
        
    },
    finishDate: {
        type: Date, 
        require: true
    }
})
module.exports = mongoose.model('Event', EventSchema);

// module.exports = mongoose.model('Campground', CampgroundSchema);
