const Joi = require('joi');
/*This modules are for validating data in middlewares to put
then into a schemas, but befere we need to "simulate" them*/
//Docs: https://joi.dev/api/?v=17.9.1#date
module.exports.eventSchema = Joi.object({
    event: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        startDate: Joi.date().required(), 
        finishDate: Joi.date().min('now').greater(Joi.ref('startDate')).required()
        //have not sense to add a new event already expired
    }).required()
}); //Create a schema for validate users

module.exports.userSchema = Joi.object({
    user: Joi.object({
        nombre: Joi.string().required(),
        carnet: Joi.number().required(),
        telefono: Joi.number().max(99999998).min(00000000).required(), 
        correo: Joi.string().required(), 
        contrasenia: Joi.string().min(6).required()
    }).required()

    
}); 

