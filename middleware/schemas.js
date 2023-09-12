const Joi = require('joi');
/*This modules are for validating data in middlewares to put
then into a schemas, but befere we need to "simulate" them*/
//Docs: https://joi.dev/api/?v=17.9.1#date
module.exports.eventSchema = Joi.object({
    event: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        startdate: Joi.date().min('now').required(), 
        finishdate: Joi.date().greater(Joi.ref('startdate')).required()
    }).required()
}); //Create a schema for validate users