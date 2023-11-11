const {eventSchema, userSchema, proyectSchema, teacherSchema} = require('./schemas.js');
const ExpressError = require('../utils/ExpressError.js')
const {semesterSchema} = require('./schemas.js');
const Semestre = require('../models/semestre');
const User = require('../models/user');
module.exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    // console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log("The Event is not validated!!!! in middlewares ");
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const {error} = userSchema.validate(req.body);
    // console.log("Error", error);
    /* Recordar que Joi valida el usuario pero no mongo; mongo niega usuarios con 
     el mismo id, correo...*/
    if (error) {
        
        const msg = error.details.map(el => el.message).join(',')
        console.log("The User is not validated!!!! in middlewares ");
        console.log(msg);
        req.flash('error', msg);
        return res.redirect('/register');
    } else {
        next();
    }
}
module.exports.validateSemester = async(req, res, next) => {
    const {error} = semesterSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('error', msg);
        return res.redirect('/semestre');
    } else {
        const isExist = await Semestre.findOne({year: req.body.semestre.year, period: req.body.semestre.period});
        if(isExist) {
            req.flash('error', '¡El semestre ya está registrado!');
            return res.redirect('/semestre');
        }
        next();
    }
}
module.exports.registeredCarnet = async (req, res, next) => {
    const carnet = req.body.user.carnet;
    const user = await User.findOne({carnet: carnet});
    if(!user){
        req.flash('error', 'El carnet no está registrado');
        return res.redirect('/register');
    }else{
        next();
    }
}

module.exports.validateTeacher = (req, res, next) => {
    const {error} = teacherSchema.validate(req.body);
    // console.log("Error", error);
    /* Recordar que Joi valida el usuario pero no mongo; mongo niega usuarios con 
     el mismo id, correo...*/
    if (error) {
        
        const msg = error.details.map(el => el.message).join(',')
        console.log("This teacher could not be validated in middleware ");
        console.log(msg);
        req.flash('error', msg);
        return res.redirect('/user');
    } else {
        next();
    }
}

module.exports.isLoggedIn =(req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', '¡Primero debes loggearte!');
        return res.redirect('/signin');
    }
    next();
}
module.exports.isAdmin = (req, res, next) => {
    if(req.user.esAdmin === true){
        next();
    }else{
        console.log("No eres admin", req.originalUrl);
        req.flash('error', '¡No tienes permisos para hacer eso!');
        return res.redirect('/user');
    }
}

module.exports.validateProyect = (req, res, next) => {


    const {error} = proyectSchema.validate(req.body);

    if (error) {
        
        const msg = error.details.map(el => el.message).join(',')
        console.log("Project could not be validated by middlewares ");
        console.log(msg);
        req.flash('error', msg);
        return res.redirect('/user');
    } else {
        next();
    }
}