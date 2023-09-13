const Event = require('../models/events');
const {mapManyEvents , mapOneEvent} = require('../utils/events');
module.exports.renderIndex = async(req, res) =>{
    const events = await Event.find({
        // finishDate:{ $gt : new Date().getDate()-10} 
    });
    const eventsData = mapManyEvents(events);
    res.render('events/index', {events: eventsData});
}
module.exports.renderNewEvent = (req, res)=>{
    res.render('events/new')
}
module.exports.showEvent = async (req, res) =>{
    const event = await Event.findById(req.params.id);
    if(!event){
        console.log("El evento no se encuentra, funcion showEvent en controlers");
        return res.redirect('/events');
    }
    const eventData  = mapOneEvent(event);
    res.render('events/show', {event: eventData});
}

module.exports.createEvent = async (req,res, next) =>{
    const newEvent  = req.body.event; 
    newEvent.startDate = new Date(newEvent.startDate);
    newEvent.finishDate = new Date(newEvent.finishDate);
    const event  = new Event(newEvent);
    await event.save();
    res.redirect('/events');
}
