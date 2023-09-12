const Event = require('../models/events');
module.exports.renderIndex = (req, res) =>{
    res.render('events/index');
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
