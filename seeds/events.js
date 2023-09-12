const mongoose = require("mongoose");
const Event = require('../models/events');
const methodOverride = require('method-override');
const {eventsNames, eventsDescriptions, getRandomDate} = require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/gestion-de-anteproyectos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]; //choose a random data from the array in parameter
const seedEvents = async()=>{
    await Event.deleteMany({});
    for(let i = 0; i<10; i++){  
        const newEvent = new Event({
            title: `${sample(eventsNames)}`,
            description: `${sample(eventsDescriptions)}`,
            startDate: getRandomDate(),
            finishDate: getRandomDate()
        })
        await newEvent.save()
    }
    console.log("Seeds added");
}
seedEvents().then(() => {
    mongoose.connection.close();
})
