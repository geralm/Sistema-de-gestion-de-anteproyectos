const Event = require('../models/events');
module.exports.renderIndex = async(req, res) =>{
    const events = await Event.find({
        // finishDate:{ $gt : new Date().getDate()-10} 
    });
    const eventsData = events.map(event => ({
        title: event.title,
        startDate: event.startDate.toDateString() ,
        finishDate: event.finishDate.toDateString(),
        description: event.description || 'Sin descripción'
      }));
    res.render('events/index', {events: eventsData});
}
module.exports.renderNewEvent = (req, res)=>{
    res.render('events/new')
}
module.exports.createEvent = async (req,res, next) =>{
    const {title ,description, startdate, finishdate} = req.body.event;
    console.log(title, description, startdate, finishdate);
    
    // const newEvent = new Event(req.body.event);
    // await newEvent.save();
    res.redirect('/events');
}
