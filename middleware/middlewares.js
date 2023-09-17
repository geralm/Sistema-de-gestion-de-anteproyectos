const {eventSchema, userSchema} = require('./schemas.js');
const ExpressError = require('../utils/ExpressError.js')

module.exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log("The Event is not validated!!!! in middlewares ");
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log("The User is not validated!!!! in middlewares ");
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}