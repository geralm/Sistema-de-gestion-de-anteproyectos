const {eventSchema, userSchema} = require('./schemas.js');
const ExpressError = require('../utils/ExpressError.js')

module.exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    // console.log(req.body);
    /* */
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
        // throw new ExpressError(msg, 400)
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
        return res.redirect('/student');
    }
}