const Event = require('../models/events');
const eventsFunc = require('../utils/events');
module.exports.renderIndex = async(req, res) =>{
    const events = await Event.find({
        // finishDate:{ $gt : new Date().getDate()-10} 
    });
    const eventsData = eventsFunc.mapManyEvents(events, eventsFunc.toDateString);
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
    const eventData  = eventsFunc.mapOneEvent(event, eventsFunc.toDateString);
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

module.exports.renderEditForm = async (req, res, next)=>{
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
        req.flash('error', 'Cannot find that evemt!');
        return res.redirect('/events');
    }
    const eventData  = eventsFunc.mapOneEvent(event, eventsFunc.toInputString);
    res.render('events/edit', { event:eventData });

}
module.exports.updateEvent = async (req, res ,next)=>{
    const { id } = req.params;
    req.body.event.startDate = new Date(req.body.event.startDate);
    req.body.event.finishDate = new Date(req.body.event.finishDate);
    const event = await Event.findByIdAndUpdate(id, { ...req.body.event });
    await event.save();
    res.redirect(`/events/${event._id}`)
}
module.exports.deleteEvent = async (req,res,next)=>{
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.redirect('/events');
}
